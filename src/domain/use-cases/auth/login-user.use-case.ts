import { JwtAdapter } from "../../../config/jwt";
import { LoginDto } from "../../dtos/auth/login.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

type GenerateToken = (
    payload: object,
    duration?: string
) => Promise<string | null>;

interface LoginUserUseCase {
    execute(loginDto: LoginDto): Promise<string>;
}

export class LoginUser implements LoginUserUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private generateToken: GenerateToken = JwtAdapter.generateToken
    ) {}

    async execute(loginDto: LoginDto): Promise<string> {
        const user = await this.authRepository.login(loginDto);
        const token = await this.generateToken(
            { id: user.id, role: user.role },
            "2h"
        );
        if (!token)
            throw CustomError.internalServerError("Error generating token");

        return token;
    }
}
