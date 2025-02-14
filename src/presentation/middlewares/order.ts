import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { OrderEntity } from "../../domain/entities/order.entity";
import { RedisAdapter } from "../../config/redis";

declare global {
    namespace Express {
        interface Request {
            order?: OrderEntity;
        }
    }
}

export class OrderMiddleware {
    static validateOrderByID =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;

            try {
                const order = await pool.query(
                    "SELECT * FROM orders WHERE id = $1",
                    [id]
                );

                if (order.rowCount == 0) {
                    res.status(404).json({
                        success: false,
                        error: "order not found",
                    });
                    return;
                }

                req.order = order.rows[0];
                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Internal server error",
                });
                return;
            }
        };

    static validateOrderByTrackingCode =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { tracking_code } = req.query;

            try {
                const client = RedisAdapter.getClient();
                if (!client) {
                    console.warn(
                        "⚠️ Redis is not available. It will continue without cache."
                    );
                } else {
                    const replay = await client.get("order");
                    if (replay) {
                        req.order = JSON.parse(replay);
                        next();
                        return;
                    }
                }

                const order = await pool.query(
                    "SELECT * FROM orders WHERE tracking_code = $1",
                    [tracking_code]
                );
                if (client) {
                    await client.setEx(
                        "order",
                        120,
                        JSON.stringify(order.rows[0])
                    );
                }

                if (order.rowCount == 0) {
                    res.status(404).json({
                        success: false,
                        error: "The consulted guide was not found",
                    });
                    return;
                }

                req.order = order.rows[0];
                next();
            } catch (error) {
                console.log(error);

                res.status(500).json({
                    success: false,
                    error: "Internal server error",
                });
                return;
            }
        };
}
