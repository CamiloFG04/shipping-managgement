import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt";

interface T {
    id: string;
    role: string;
}

export class AuthMiddleware {
    static validateToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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
            req.body.payload = payload;
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        next();
    };
}
