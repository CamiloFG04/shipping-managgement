import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { OrderEntity } from "../../domain/entities/order.entity";

declare global {
    namespace Express {
        interface Request {
            order?: OrderEntity;
        }
    }
}

export class OrderMiddleware {
    static validateOrder =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            console.log(id);

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
}
