import { Pool } from "pg";
import { AuthDataSource } from "../../domain/datasources/auth.datasource";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { BcryptAdapter } from "../../config/bcryp";

export class AuthDataSourceImpl implements AuthDataSource {
    constructor(private readonly pool: Pool) {}

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        const { name, email, password, phone, identification } = registerDto;
        try {
            const exists = await this.pool.query(
                "SELECT * FROM users WHERE email = $1 OR identification = $2",
                [email, identification]
            );

            if (exists.rowCount > 0)
                throw CustomError.badRequest("User is already registered");

            const hashPass = await BcryptAdapter.hash(password);

            const newUser = await this.pool.query(
                "INSERT INTO users (name, email, password, phone, identification, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [name, email, hashPass, phone, identification, "user"]
            );

            return new UserEntity(
                1,
                name,
                email,
                hashPass,
                phone,
                identification,
                "user"
            );
        } catch (error) {
            console.log(error);

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }
}
