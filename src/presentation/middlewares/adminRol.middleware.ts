import { NextFunction, Request, Response } from "express";

export class ValidateAdminRolMiddleware {
    static validateAdminRol = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { role } = req.user;

        try {
            if (role !== "admin") {
                res.status(403).json({
                    success: false,
                    error: "Forbidden: Insufficient permissions",
                });
                return;
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    };
}
