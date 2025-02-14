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
            const order = await this.pool.query(
                `UPDATE orders SET status = $1, transporter_id = $2, assigned_at = NOW() WHERE id = $3 RETURNING *`,
                ["In transit", transporter_id, id]
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

    async getOrderDetail(
        orderDetailDto: OrderDetailDto
    ): Promise<OrderDetailEntity> {
        const { tracking_code } = orderDetailDto;

        try {
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

            return OrderMapper.orderEntityDetailFromObject(order.rows[0]);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }
}
