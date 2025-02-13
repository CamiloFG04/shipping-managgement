import { Validators } from "../../../config/validator";

export class OrderDto {
    private constructor(
        public user_id: number,
        public tracking_code: string,
        public package_weight: number,
        public package_dimensions: string,
        public product_type: string,
        public origin_address: string,
        public recipient_name: string,
        public recipient_phone: string,
        public recipient_identification: string,
        public destination_address: string,
        public status: string,
        public transporter_id?: number,
        public assigned_at?: Date,
        public delivery_at?: Date
    ) {}

    static create(object: { [key: string]: any }): [string?, OrderDto?] {
        const {
            user_id,
            tracking_code,
            package_weight,
            package_dimensions,
            product_type,
            origin_address,
            recipient_name,
            recipient_phone,
            recipient_identification,
            destination_address,
            status,
            transporter_id,
            assigned_at,
            delivery_at,
        } = object;

        if (!user_id) return ["Missing user"];
        if (!tracking_code) return ["Missing tracking code"];
        if (!package_weight) return ["Missing package weight"];
        if (!package_dimensions) return ["Missing package dimensions"];
        if (!product_type) return ["Missing product type"];
        if (!origin_address) return ["Missing origin address"];
        if (!recipient_name) return ["Missing recipient name"];
        if (!recipient_phone) return ["Missing recipient phone"];
        if (!recipient_identification)
            return ["Missing recipient identification"];
        if (!destination_address) return ["Missing destination address"];
        if (!status) return ["Missing status"];

        return [
            undefined,
            new OrderDto(
                user_id,
                tracking_code,
                package_weight,
                package_dimensions,
                product_type,
                origin_address,
                recipient_name,
                recipient_phone,
                recipient_identification,
                destination_address,
                status,
                transporter_id,
                assigned_at,
                delivery_at
            ),
        ];
    }
}
