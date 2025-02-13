import { Validators } from "../../../config/validator";

export class RegisterDto {
    private constructor(
        public name: string,
        public email: string,
        public password: string,
        public phone: string,
        public identification: string
    ) {}

    static create(object: { [key: string]: any }): [string?, RegisterDto?] {
        const { name, email, password, phone, identification } = object;

        if (!name) return ["Missing name"];
        if (!email) return ["Missing email"];
        if (!Validators.email.test(email)) return ["Email is not valid"];
        if (!Validators.password.test(password))
            return [
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
            ];
        if (!phone) return ["Missing phone"];
        if (!identification) return ["Missing identification"];

        return [
            undefined,
            new RegisterDto(
                name,
                email.toLowerCase(),
                password,
                phone,
                identification
            ),
        ];
    }
}
