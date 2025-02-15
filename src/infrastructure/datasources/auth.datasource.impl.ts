import { Pool } from "pg";
import { AuthDataSource } from "../../domain/datasources/auth.datasource";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { BcryptAdapter } from "../../config/bcryp";
import { UserMapper } from "../mappers/user.mapper";
import { LoginDto } from "../../domain/dtos/auth/login.dto";

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

            return UserMapper.userEntityFromObject(newUser.rows[0]);
        } catch (error) {
            console.log(error);

            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError();
        }
    }

    async login(loginDto: LoginDto): Promise<UserEntity> {
        const { email, password } = loginDto;
        const user = await this.pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (user.rowCount === 0) throw CustomError.badRequest("User not found");

        const comparePassword = await BcryptAdapter.compare(
            password,
            user.rows[0].password
        );
        if (!comparePassword) throw CustomError.unauthorized("Unauthorized");

        return UserMapper.userEntityFromObject(user.rows[0]);
    }
}
