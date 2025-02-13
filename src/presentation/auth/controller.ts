import { Request, Response } from "express";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository";

export class AutController {

    constructor(
        private readonly authRepository: AuthRepository
    ) {}

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body)
        if (error){
            res.status(400).json({success: false, error})
            return 
        }
        this.authRepository.register(registerDto!)
            .then((user) => res.status(200).json({success: true, user}))
            .catch(error => res.status(500).json({success: false, error}))
    }

    loginUser = (req: Request, res: Response) => {
        res.json('loginUser controller')
        
    }
}