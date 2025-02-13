import { AuthDataSource } from "../../domain/datasources/auth.datasource";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthDataSourceImpl implements AuthDataSource {
    async register(registerDto: RegisterDto): Promise<UserEntity> {
        const { name, email, password, phone, identification } = registerDto;
        try {
            return new UserEntity(
                1,
                name,
                email,
                password,
                phone,
                identification,
                "user"
            );
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }
}
