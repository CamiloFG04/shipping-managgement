import { OrderDto } from "../dtos/orders/order.dto";
import { OrderAssignDto } from "../dtos/orders/orderAssign.dto";
import { OrderEntity } from "../entities/order.entity";

export abstract class OrderRepository {
    abstract store(orderDto: OrderDto): Promise<OrderEntity>;
    abstract update(orderAssignDto: OrderAssignDto): Promise<OrderEntity>;
}
