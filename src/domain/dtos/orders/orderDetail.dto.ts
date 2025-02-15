export class OrderDetailDto {
    private constructor(public tracking_code: string) {}

    static create(object: { [key: string]: any }): [string?, OrderDetailDto?] {
        const { tracking_code } = object;

        if (!tracking_code) return ["Missing tracking code"];

        return [undefined, new OrderDetailDto(tracking_code)];
    }
}
