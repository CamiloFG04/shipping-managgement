import { OrderDetailDto } from "../../dtos/orders/orderDetail.dto";
import { OrderRepository } from "../../repositories/order.repository";

interface Order {
    id: number;
    user_id: number;
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
    transporter_id?: number;
    assigned_at?: Date;
    delivery_at?: Date;
}

interface CloseOrderUseCase {
    execute(orderDetailDto: OrderDetailDto): Promise<Order>;
}

export class CloseOrder implements CloseOrderUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(orderDetailDto: OrderDetailDto): Promise<Order> {
        const order = await this.orderRepository.closeOrder(orderDetailDto);
        return {
            id: order.id,
            user_id: order.user_id,
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
            transporter_id: order.transporter_id,
            assigned_at: order.assigned_at,
            delivery_at: order.delivery_at,
        };
    }
}
