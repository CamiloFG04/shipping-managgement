export class OrderEntity {
    constructor(
        public id: number,
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
}
