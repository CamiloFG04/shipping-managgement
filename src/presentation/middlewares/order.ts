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
                        message: "Order not found",
                    });
                    return;
                }

                if (order.rows[0].status === "Delivered") {
                    res.status(409).json({
                        success: false,
                        message:
                            "This order has already been delivered and cannot be updated",
                    });
                    return;
                }

                if (order.rows[0].transporter_id !== null) {
                    res.status(409).json({
                        success: false,
                        message:
                            "This order already has a transporter assigned",
                    });
                    return;
                }

                req.order = order.rows[0];
                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
                return;
            }
        };

    static validateOrderByTrackingCode =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { tracking_code } = req.query;

            try {
                const order = await pool.query(
                    "SELECT * FROM orders WHERE tracking_code = $1",
                    [tracking_code]
                );

                if (order.rowCount == 0) {
                    res.status(404).json({
                        success: false,
                        message: "The consulted guide was not found",
                    });
                    return;
                }

                req.order = order.rows[0];
                next();
            } catch (error) {
                console.log(error);

                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
                return;
            }
        };

    static validateCloseOrderByTrackingCode =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { tracking_code } = req.params;

            try {
                const order = await pool.query(
                    "SELECT * FROM orders WHERE tracking_code = $1",
                    [tracking_code]
                );

                if (order.rowCount == 0) {
                    res.status(404).json({
                        success: false,
                        message: "The consulted guide was not found",
                    });
                    return;
                }

                if (order.rows[0].status === "On hold") {
                    res.status(409).json({
                        success: false,
                        message:
                            "You are not allowed to close an order that is on hold",
                    });
                    return;
                }

                req.order = order.rows[0];
                next();
            } catch (error) {
                console.log(error);

                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
                return;
            }
        };
}
