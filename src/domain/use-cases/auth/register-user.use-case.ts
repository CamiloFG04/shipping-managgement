import { RegisterDto } from "../../dtos/auth/register.dto";
import { AuthRepository } from "../../repositories/auth.repository";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface RegisterUserUseCase {
    execute(registerDto: RegisterDto): Promise<User>;
}

export class RegisterUser implements RegisterUserUseCase {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(registerDto: RegisterDto): Promise<User> {
        const user = await this.authRepository.register(registerDto);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
