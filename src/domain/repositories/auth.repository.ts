import { UserEntity } from "../entities/user.entity";

export abstract class AuthRepository {
    abstract register(name: string, email: string, password: string): Promise<UserEntity>;
    abstract login(email: string, password: string): Promise<UserEntity>;

}