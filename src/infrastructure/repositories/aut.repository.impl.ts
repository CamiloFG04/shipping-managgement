import { AuthDataSource } from "../../domain/datasources/auth.datasource";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";


export class AuthRepositoryImpl implements AuthRepository {
    constructor(
        private readonly dataSource: AuthDataSource
    ) {}

    register(registerDto: RegisterDto): Promise<UserEntity> {
        return this.dataSource.register(registerDto);
    }
}