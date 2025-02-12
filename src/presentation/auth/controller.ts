import { Request, Response } from "express";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";

export class AutController {

    constructor() {}

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body)
        if (error){
            res.status(400).json({success: false, error})
            return 
        } 
        res.status(200).json({success: true ,registerDto})
    }

    loginUser = (req: Request, res: Response) => {
        res.json('loginUser controller')
        
    }
}