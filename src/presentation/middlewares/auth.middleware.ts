import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt";
import { Pool } from "pg";
import { UserEntity } from "../../domain/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}

interface T {
    id: string;
    role: string;
}

export class AuthMiddleware {
    static validateToken =
        (pool: Pool) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const authorization = req.header("Authorization");
            if (!authorization) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            if (!authorization.startsWith("Bearer ")) {
                res.status(401).json({ error: "Invalid Bearer token" });
                return;
            }

            const token = authorization.split(" ").at(1) || "";
            try {
                const payload = await JwtAdapter.validateToken<T>(token);

                if (!payload) {
                    res.status(401).json({ error: "Invalid token" });
                    return;
                }
                const user = await pool.query(
                    "SELECT id, name, email, role, phone, identification  FROM users WHERE id = $1",
                    [payload.id]
                );
                if (user.rowCount == 0) {
                    res.status(401).json({
                        error: "Invalid token - user not found",
                    });
                    return;
                }

                req.user = user.rows[0];
                next();
            } catch (error) {
                res.status(500).json({ error: "Internal server error" });
                return;
            }
        };
}
