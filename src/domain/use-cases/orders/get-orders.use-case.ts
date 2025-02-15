import { OrdersDto } from "../../dtos/orders/orders.dto";
import { OrderRepository } from "../../repositories/order.repository";

interface Order {
    id: number;
    tracking_number: string;
    status: string;
    pickup_date: Date;
    delivery_date: Date;
    transportist: string;
    delivery_time: number;
    avg_delivery_time: number;
}

interface OrdersUseCase {
    execute(ordersDto: OrdersDto): Promise<Order[]>;
}

export class OrdersDetail implements OrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(ordersDto: OrdersDto): Promise<Order[]> {
        const orders = await this.orderRepository.orders(ordersDto);

        return orders.map((row) => ({
            id: row.id,
            tracking_number: row.tracking_number,
            status: row.status,
            pickup_date: row.pickup_date,
            delivery_date: row.delivery_date,
            delivery_hour: row.delivery_hour,
            pickup_hour: row.pickup_hour,
            transportist: row.transportist,
            delivery_time: row.delivery_time,
            avg_delivery_time: row.avg_delivery_time,
        }));
    }
}
