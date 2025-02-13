import { OrderDto } from "../dtos/orders/order.dto";
import { OrderEntity } from "../entities/order.entity";

export abstract class OrderRepository {
    abstract store(orderDto: OrderDto): Promise<OrderEntity>;
}
