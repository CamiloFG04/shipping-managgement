import { Request, Response } from "express";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { CustomError } from "../../domain/errors/custom.error";

export class AutController {
    constructor(private readonly authRepository: AuthRepository) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
        }
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    };

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }
        this.authRepository
            .register(registerDto!)
            .then((user) => res.status(200).json({ success: true, user }))
            .catch((error) => this.handleError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        res.json("loginUser controller");
    };
}
