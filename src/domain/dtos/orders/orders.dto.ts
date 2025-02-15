export class OrdersDto {
    private constructor(
        public startDate?: Date,
        public endDate?: Date,
        public status?: string,
        public transporter?: number,
        public limit?: number
    ) {}

    static create(object: { [key: string]: any }): [string?, OrdersDto?] {
        const { startDate, endDate, status, transporter, limit } = object;

        return [
            undefined,
            new OrdersDto(startDate, endDate, status, transporter, limit),
        ];
    }
}
