import { UserEntity } from "../entities/user.entity";
import { RegisterDto } from "../dtos/auth/register.dto";
import { LoginDto } from "../dtos/auth/login.dto";

export abstract class AuthDataSource {
    abstract register(registerDto: RegisterDto): Promise<UserEntity>;
    abstract login(loginDto: LoginDto): Promise<UserEntity>;
}
