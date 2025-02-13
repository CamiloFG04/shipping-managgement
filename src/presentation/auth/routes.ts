import { Router } from "express";
import { AutController } from "./controller";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/aut.repository.impl";
import { AuthDataSourceImpl } from "../../infrastructure/datasources/auth.datasource.impl";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const dataSource = new AuthDataSourceImpl();
        const authRepository = new AuthRepositoryImpl(dataSource);
        const controller = new AutController(authRepository);

        router.post("/register", controller.registerUser);
        router.post("/login", controller.loginUser);

        return router;
    }
}
