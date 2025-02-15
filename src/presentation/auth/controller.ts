import { Request, Response } from "express";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginDto } from "../../domain/dtos/auth/login.dto";
import { RegisterUser } from "../../domain/use-cases/auth/register-user.use-case";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";

export class AutController {
    constructor(private readonly authRepository: AuthRepository) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        return;
    };

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new RegisterUser(this.authRepository)
            .execute(registerDto)
            .then((user) => {
                res.status(201).json({
                    success: true,
                    user,
                    message: "Successfully registered user",
                });
            })
            .catch((error) => this.handleError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        const [error, loginDto] = LoginDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new LoginUser(this.authRepository)
            .execute(loginDto)
            .then((token) => {
                res.status(200).json({ success: true, token });
            })
            .catch((error) => this.handleError(error, res));
    };
}
