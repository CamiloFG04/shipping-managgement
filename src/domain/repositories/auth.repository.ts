import { RegisterDto } from "../dtos/auth/register.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class AuthRepository {
    abstract register(registerDto: RegisterDto): Promise<UserEntity>;
    // abstract login(email: string, password: string): Promise<UserEntity>;

}