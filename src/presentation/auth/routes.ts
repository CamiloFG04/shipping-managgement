import { Router } from "express";
import { AutController } from "./controller";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/aut.repository.impl";
import { AuthDataSourceImpl } from "../../infrastructure/datasources/auth.datasource.impl";
import { PostgreSQLDatabase } from "../../data/postgresql/postgreSql-database";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const pool = PostgreSQLDatabase.getPool();
        const dataSource = new AuthDataSourceImpl(pool);
        const authRepository = new AuthRepositoryImpl(dataSource);
        const controller = new AutController(authRepository);

        router.post("/register", controller.registerUser);
        router.post("/login", controller.loginUser);

        return router;
    }
}
