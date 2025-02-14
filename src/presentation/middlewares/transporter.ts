import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";

export class TransporterMiddleware {
    static validateTransporter =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const { transporter_id } = req.body;
            try {
                const transporter = await pool.query(
                    "SELECT tran.*, vh.type, vh.capacity FROM transporters tran INNER JOIN vehicles vh ON vh.transporter_id = tran.id WHERE tran.id = $1",
                    [transporter_id]
                );

                console.log(transporter.rows[0]);

                if (transporter.rowCount == 0) {
                    res.status(404).json({
                        success: false,
                        error: "Transporter not found",
                    });
                    return;
                }

                if (!transporter.rows[0].available) {
                    res.status(409).json({
                        success: false,
                        error: "Transporter is not available",
                    });
                    return;
                }

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
