export class OrderAssignDto {
    private constructor(public id: number, public transporter_id: number) {}

    static create(object: { [key: string]: any }): [string?, OrderAssignDto?] {
        const { id, transporter_id } = object;

        if (!id) return ["Missing order ID"];
        if (!transporter_id) return ["Missing transporter"];

        return [undefined, new OrderAssignDto(id, transporter_id)];
    }
}
