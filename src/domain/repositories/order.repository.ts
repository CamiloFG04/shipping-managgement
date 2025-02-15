import { OrderDto } from "../dtos/orders/order.dto";
import { OrderAssignDto } from "../dtos/orders/orderAssign.dto";
import { OrderDetailDto } from "../dtos/orders/orderDetail.dto";
import { OrdersDto } from "../dtos/orders/orders.dto";
import { OrderEntity } from "../entities/order.entity";
import { OrderDetailEntity } from "../entities/orderDetail.entity";
import { OrdersEntity } from "../entities/orders.entity";

export abstract class OrderRepository {
    abstract store(orderDto: OrderDto): Promise<OrderEntity>;
    abstract update(orderAssignDto: OrderAssignDto): Promise<OrderEntity>;
    abstract getOrderDetail(
        orderDetailDto: OrderDetailDto
    ): Promise<OrderDetailEntity>;
    abstract closeOrder(orderDetailDto: OrderDetailDto): Promise<OrderEntity>;
    abstract orders(ordersDto: OrdersDto): Promise<OrdersEntity[]>;
}
