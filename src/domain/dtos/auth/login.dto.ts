import { Validators } from "../../../config/validator";

export class LoginDto {
    private constructor(public email: string, public password: string) {}

    static create(object: { [key: string]: any }): [string?, LoginDto?] {
        const { email, password } = object;

        if (!email) return ["Missing email"];
        if (!Validators.email.test(email)) return ["Email is not valid"];
        if (!password) return ["Missing password"];

        return [undefined, new LoginDto(email.toLowerCase(), password)];
    }
}
