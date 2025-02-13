import { JwtAdapter } from "../../../config/jwt";
import { RegisterDto } from "../../dtos/auth/register.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

type GenerateToken = (
    payload: object,
    duration?: string
) => Promise<string | null>;

interface RegisterUserUseCase {
    execute(registerDto: RegisterDto): Promise<User>;
}

export class RegisterUser implements RegisterUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private generateToken: GenerateToken = JwtAdapter.generateToken
    ) {}

    async execute(registerDto: RegisterDto): Promise<User> {
        const user = await this.authRepository.register(registerDto);
        const token = await this.generateToken(
            { id: user.id, role: user.role },
            "2h"
        );
        if (!token)
            throw CustomError.internalServerError("Error generating token");

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
