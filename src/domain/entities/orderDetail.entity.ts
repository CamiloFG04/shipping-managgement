export class OrderDetailEntity {
    constructor(
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
        public user_name: string,
        public user_phone: string,
        public user_identification: string,
        public transporter_name?: string,
        public transporter_identification?: string
    ) {}
}
