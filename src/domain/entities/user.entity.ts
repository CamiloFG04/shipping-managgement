export class UserEntity {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public password: string,
        public phone: string,
        public identification: string,
        public role: string
    ) {}
}
