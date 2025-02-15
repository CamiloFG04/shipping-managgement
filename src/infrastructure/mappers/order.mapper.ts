import { OrderEntity } from "../../domain/entities/order.entity";
import { OrderDetailEntity } from "../../domain/entities/orderDetail.entity";
import { OrdersEntity } from "../../domain/entities/orders.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class OrderMapper {
    public static orderEntityFromObject(object: { [key: string]: any }) {
        const {
            id,
            user_id,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
            status,
            tracking_code,
            transporter_id,
            assigned_at,
            delivery_at,
        } = object;

        if (!user_id) throw CustomError.badRequest("User is required");
        if (!package_weight)
            throw CustomError.badRequest("Package weight is required");
        if (!package_dimensions)
            throw CustomError.badRequest("Package dimensions is required");
        if (!product_type)
            throw CustomError.badRequest("Product type is required");
        if (!origin_address)
            throw CustomError.badRequest("Origin address is required");
        if (!recipient_name)
            throw CustomError.badRequest("Recipient name is required");
        if (!recipient_phone)
            throw CustomError.badRequest("Recipient phone is required");
        if (!recipient_identification)
            throw CustomError.badRequest(
                "Recipient identification is required"
            );
        if (!destination_address)
            throw CustomError.badRequest("Destination address is required");
        if (!status) throw CustomError.badRequest("Status is required");
        if (!tracking_code)
            throw CustomError.badRequest("Tracking code is required");

        return new OrderEntity(
            id,
            user_id,
            tracking_code,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
            status,
            transporter_id,
            assigned_at,
            delivery_at
        );
    }

    public static orderEntityDetailFromObject(object: { [key: string]: any }) {
        const {
            tracking_code,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
            status,
            user_name,
            user_phone,
            user_identification,
            transporter_name,
            transporter_identification,
            assigned_at,
            delivery_at,
        } = object;

        if (!tracking_code)
            throw CustomError.badRequest("Tracking code is required");
        if (!package_weight)
            throw CustomError.badRequest("Package weight is required");
        if (!package_dimensions)
            throw CustomError.badRequest("Package dimensions is required");
        if (!product_type)
            throw CustomError.badRequest("Product type is required");
        if (!origin_address)
            throw CustomError.badRequest("Origin address is required");
        if (!recipient_name)
            throw CustomError.badRequest("Recipient name is required");
        if (!recipient_phone)
            throw CustomError.badRequest("Recipient phone is required");
        if (!recipient_identification)
            throw CustomError.badRequest(
                "Recipient identification is required"
            );
        if (!destination_address)
            throw CustomError.badRequest("Destination address is required");
        if (!status) throw CustomError.badRequest("Status is required");
        if (!user_name) throw CustomError.badRequest("User name is required");
        if (!user_phone) throw CustomError.badRequest("User phone is required");
        if (!user_identification)
            throw CustomError.badRequest("User identification is required");

        return new OrderDetailEntity(
            tracking_code,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
            status,
            user_name,
            user_phone,
            user_identification,
            transporter_name,
            transporter_identification,
            assigned_at,
            delivery_at
        );
    }

    public static ordersEntityFromObject(rows: OrdersEntity[]): OrdersEntity[] {
        return rows.map(
            (row) =>
                new OrdersEntity(
                    row.id,
                    row.tracking_number,
                    row.status,
                    row.pickup_date,
                    row.delivery_date,
                    row.pickup_hour,
                    row.delivery_hour,
                    row.transportist,
                    row.delivery_time,
                    row.avg_delivery_time
                )
        );
    }
}
