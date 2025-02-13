import { Router } from "express";
import { OrderController } from "./controller";
import { PostgreSQLDatabase } from "../../data/postgresql/postgreSql-database";
import { OrderDataSourceImpl } from "../../infrastructure/datasources/order.datasource.impl";
import { OrderRepositoryImpl } from "../../infrastructure/repositories/order.repository.impl";

export class OrderRoutes {
    static get routes(): Router {
        const router = Router();
        const pool = PostgreSQLDatabase.getPool();
        const dataSource = new OrderDataSourceImpl(pool);
        const orderRepository = new OrderRepositoryImpl(dataSource);
        const controller = new OrderController(orderRepository);

        router.post("/", controller.store);

        return router;
    }
}
