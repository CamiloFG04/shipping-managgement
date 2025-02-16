import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { OrderRoutes } from "./orders/routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use("/api/auth", AuthRoutes.routes);
        router.use("/api/orders", OrderRoutes.routes);

        return router;
    }
}
