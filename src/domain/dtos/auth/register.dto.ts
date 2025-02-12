import { Validators } from "../../../config/validator"

export class RegisterDto {
    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) {}

    static create(object: {[key: string]: any}): [string?, RegisterDto?] {
        const {name, email, password} = object

        if (!name) return ['Missing name']
        if (!email) return ['Missing email']
        if (!Validators.email.test(email)) return ['Email is not valid']
        if (!Validators.password.test(password)) return ['Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character']

        return [undefined, new RegisterDto(name, email.toLowerCase(), password)]
    }
}