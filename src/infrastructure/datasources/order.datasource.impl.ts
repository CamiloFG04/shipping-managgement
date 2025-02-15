import { Pool } from "pg";
import { OrderDataSource } from "../../domain/datasources/order.datasource";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { OrderEntity } from "../../domain/entities/order.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderMapper } from "../mappers/order.mapper";
import { TrackingCode } from "../../config/tranckingCode";
import { OrderAssignDto } from "../../domain/dtos/orders/orderAssign.dto";
import { OrderDetailDto } from "../../domain/dtos/orders/orderDetail.dto";
import { OrderDetailEntity } from "../../domain/entities/orderDetail.entity";
import { RedisAdapter } from "../../config/redis";
import { OrdersDto } from "../../domain/dtos/orders/orders.dto";
import { OrdersEntity } from "../../domain/entities/orders.entity";

export class OrderDataSourceImpl implements OrderDataSource {
    constructor(private readonly pool: Pool) {}

    async store(orderDto: OrderDto): Promise<OrderEntity> {
        const {
            user_id,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
        } = orderDto;

        try {
            const trackingCode = TrackingCode.generateTrackingCode;
            const order = await this.pool.query(
                `INSERT INTO orders (
                    user_id, tracking_code, package_weight, package_dimensions, 
                    product_type, origin_address, recipient_name, recipient_phone, 
                    recipient_identification, destination_address
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ) RETURNING *`,
                [
                    user_id,
                    trackingCode,
                    package_weight,
                    package_dimensions,
                    product_type,
                    origin_address,
                    recipient_name,
                    recipient_phone,
                    recipient_identification,
                    destination_address,
                ]
            );

            return OrderMapper.orderEntityFromObject(order.rows[0]);
        } catch (error) {
            console.log({ error });

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }

    async update(orderAssignDto: OrderAssignDto): Promise<OrderEntity> {
        const { id, transporter_id } = orderAssignDto;
        try {
            const client = RedisAdapter.getClient();
            const order = await this.pool.query(
                `UPDATE orders SET status = $1, transporter_id = $2, assigned_at = NOW() WHERE id = $3 RETURNING *`,
                ["In transit", transporter_id, id]
            );

            await this.pool.query(
                `UPDATE transporters SET available = false where id = $1`,
                [transporter_id]
            );
            if (client) {
                await client.del(`orderDetail:${order.rows[0].tracking_code}`);
            }

            return OrderMapper.orderEntityFromObject(order.rows[0]);
        } catch (error) {
            console.log({ error });

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }

    async getOrderDetail(
        orderDetailDto: OrderDetailDto
    ): Promise<OrderDetailEntity> {
        const { tracking_code } = orderDetailDto;

        try {
            const client = RedisAdapter.getClient();

            if (client) {
                const replay = await client.get(`orderDetail:${tracking_code}`);
                if (replay) {
                    return OrderMapper.orderEntityDetailFromObject(
                        JSON.parse(replay)
                    );
                }
            }

            const order = await this.pool.query(
                `SELECT ord.tracking_code, 
                        ord.package_weight, 
                        ord.package_dimensions, 
                        ord.product_type, 
                        ord.origin_address, 
                        ord.recipient_name, 
                        ord.recipient_phone, 
                        ord.recipient_identification, 
                        ord.destination_address, 
                        ord.status,
                        ord.assigned_at,
                        ord.delivery_at,
                        u.name as user_name,
                        u.phone as user_phone,
                        u.identification as user_identification,
                        tran.name as transporter_name,
                        tran.identification transporter_identification
                FROM orders ord 
                    INNER JOIN users u ON u.id = ord.user_id 
                    LEFT JOIN transporters tran on tran.id = ord.transporter_id 
                WHERE ord.tracking_code = $1`,
                [tracking_code]
            );

            if (client) {
                await client.setEx(
                    `orderDetail:${tracking_code}`,
                    120,
                    JSON.stringify(order.rows[0])
                );
            }

            return OrderMapper.orderEntityDetailFromObject(order.rows[0]);
        } catch (error) {
            console.log(error);

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }

    async closeOrder(orderDetailDto: OrderDetailDto): Promise<OrderEntity> {
        const { tracking_code } = orderDetailDto;
        try {
            const order = await this.pool.query(
                `UPDATE orders SET status = $1, delivery_at = NOW() WHERE tracking_code = $2 RETURNING *`,
                ["Delivered", tracking_code]
            );

            await this.pool.query(
                `UPDATE transporters SET available = true where id = $1`,
                [order.rows[0].transporter_id]
            );

            return OrderMapper.orderEntityFromObject(order.rows[0]);
        } catch (error) {
            console.log({ error });

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }

    async orders(ordersDto: OrdersDto): Promise<OrdersEntity[]> {
        const {
            startDate,
            endDate,
            status,
            transporter,
            limit = 10,
        } = ordersDto;
        try {
            let query = `
                SELECT 
                    o.id, 
                    o.tracking_code, 
                    o.status, 
                    TO_CHAR(o.assigned_at, 'YYYY-MM-DD') AS pickup_date, 
                    TO_CHAR(o.delivery_at, 'YYYY-MM-DD') AS delivery_date,
                    TO_CHAR(o.assigned_at, 'HH24:MI:SS') AS pickup_hour, 
                    TO_CHAR(o.delivery_at, 'HH24:MI:SS') AS delivery_hour,
                    t.name AS transportist,
                    ROUND(EXTRACT(EPOCH FROM (o.delivery_at - o.assigned_at)) / 3600, 2) AS delivery_time,
                     -- Subconsulta: Promedio de tiempo de entrega por transportista
                    (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (s.delivery_at - s.assigned_at)) / 3600), 2)
                    FROM orders s
                    WHERE s.transporter_id = o.transporter_id
                    AND s.status = 'Delivered') AS avg_delivery_time
                FROM orders o
                    LEFT JOIN transporters t ON o.transporter_id = t.id
                WHERE 1=1`;
            let values = [];

            if (startDate) {
                values.push(startDate);
                query += ` AND assigned_at >= $${values.length}`;
            }

            if (endDate) {
                values.push(endDate);
                query += ` AND delivery_at <= $${values.length}::timestamp`;
            }

            if (status) {
                values.push(status);
                query += ` AND status = $${values.length}`;
            }

            if (transporter) {
                values.push(transporter);
                query += ` AND transporter_id = $${values.length}`;
            }

            const orders = await this.pool.query(query, values);

            return OrderMapper.ordersEntityFromObject(orders.rows);
        } catch (error) {
            console.log({ error });

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }
}
