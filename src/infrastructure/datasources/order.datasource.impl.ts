import { Pool } from "pg";
import { OrderDataSource } from "../../domain/datasources/order.datasource";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { OrderEntity } from "../../domain/entities/order.entity";

export class OrderDataSourceImpl implements OrderDataSource {
    constructor(private readonly pool: Pool) {}
    store(orderDto: OrderDto): Promise<OrderEntity> {
        throw new Error("Method not implemented.");
    }
}
