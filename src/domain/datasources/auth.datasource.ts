import { UserEntity } from "../entities/user.entity";
import { RegisterDto } from '../dtos/auth/register.dto';

export abstract class AuthDataSource {
    abstract register(registerDto: RegisterDto): Promise<UserEntity>;
    // abstract login(email: string, password: string): Promise<UserEntity>;

}