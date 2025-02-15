import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class UserMapper {
    public static userEntityFromObject(object: { [key: string]: any }) {
        const { id, name, email, password, phone, identification, role } =
            object;

        if (!id) throw CustomError.badRequest("ID is required");
        if (!name) throw CustomError.badRequest("Name is required");
        if (!email) throw CustomError.badRequest("Email is required");
        if (!password) throw CustomError.badRequest("Password is required");
        if (!phone) throw CustomError.badRequest("Phone is required");
        if (!identification)
            throw CustomError.badRequest("Identification is required");
        if (!role) throw CustomError.badRequest("Role is required");

        return new UserEntity(
            id,
            name,
            email,
            password,
            phone,
            identification,
            role
        );
    }
}
