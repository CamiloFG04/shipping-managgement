import { Pool } from "pg";
import { OrderDataSource } from "../../domain/datasources/order.datasource";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { OrderEntity } from "../../domain/entities/order.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderMapper } from "../mappers/order.mapper";
import { TrackingCode } from "../../config/tranckingCode";

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
}
