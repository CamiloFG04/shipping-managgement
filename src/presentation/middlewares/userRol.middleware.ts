import { NextFunction, Request, Response } from "express";

export class ValidateUserRolMiddleware {
    static validateUserRol = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { role } = req.user;

        try {
            if (role !== "user") {
                res.status(403).json({
                    success: false,
                    message: "Forbidden: only users can perform this action",
                });
                return;
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
}
