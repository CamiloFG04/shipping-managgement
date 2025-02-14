import { OrderDataSource } from "../../domain/datasources/order.datasource";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { OrderAssignDto } from "../../domain/dtos/orders/orderAssign.dto";
import { OrderDetailDto } from "../../domain/dtos/orders/orderDetail.dto";
import { OrderEntity } from "../../domain/entities/order.entity";
import { OrderDetailEntity } from "../../domain/entities/orderDetail.entity";
import { OrderRepository } from "../../domain/repositories/order.repository";

export class OrderRepositoryImpl implements OrderRepository {
    constructor(private readonly dataSource: OrderDataSource) {}

    store(orderDto: OrderDto): Promise<OrderEntity> {
        return this.dataSource.store(orderDto);
    }

    update(orderAssignDto: OrderAssignDto): Promise<OrderEntity> {
        return this.dataSource.update(orderAssignDto);
    }

    getOrderDetail(orderDetailDto: OrderDetailDto): Promise<OrderDetailEntity> {
        return this.dataSource.getOrderDetail(orderDetailDto);
    }
}
