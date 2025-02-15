import { OrderDetailDto } from "../../dtos/orders/orderDetail.dto";
import { OrderRepository } from "../../repositories/order.repository";

interface Order {
    tracking_code: string;
    package_weight: number;
    package_dimensions: string;
    product_type: string;
    origin_address: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_identification: string;
    destination_address: string;
    status: string;
    user_name: string;
    user_phone: string;
    user_identification: string;
    transporter_name?: string;
    transporter_identification?: string;
    assigned_at?: Date;
    delivery_at?: Date;
}

interface OrderDetailUseCase {
    execute(orderDetailDto: OrderDetailDto): Promise<Order>;
}

export class OrderDetail implements OrderDetailUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(orderDetailDto: OrderDetailDto): Promise<Order> {
        const order = await this.orderRepository.getOrderDetail(orderDetailDto);
        return {
            tracking_code: order.tracking_code,
            package_weight: order.package_weight,
            package_dimensions: order.package_dimensions,
            product_type: order.product_type,
            origin_address: order.origin_address,
            recipient_name: order.recipient_name,
            recipient_phone: order.recipient_phone,
            recipient_identification: order.recipient_identification,
            destination_address: order.destination_address,
            status: order.status,
            user_name: order.user_name,
            user_phone: order.user_phone,
            user_identification: order.user_identification,
            transporter_name: order.transporter_name,
            transporter_identification: order.transporter_identification,
            assigned_at: order.assigned_at,
            delivery_at: order.delivery_at,
        };
    }
}
