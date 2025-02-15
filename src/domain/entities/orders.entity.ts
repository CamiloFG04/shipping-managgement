export class OrdersEntity {
    id: number;
    tracking_number: string;
    status: string;
    pickup_date: Date;
    delivery_date: Date;
    pickup_hour: string;
    delivery_hour: string;
    transportist: string;
    delivery_time: number;
    avg_delivery_time: number;

    constructor(
        id: number,
        tracking_number: string,
        status: string,
        pickup_date: Date,
        delivery_date: Date,
        pickup_hour: string,
        delivery_hour: string,
        transportist: string,
        delivery_time: number,
        avg_delivery_time: number
    ) {
        this.id = id;
        this.tracking_number = tracking_number;
        this.status = status;
        this.pickup_date = pickup_date;
        this.delivery_date = delivery_date;
        this.pickup_hour = pickup_hour;
        this.delivery_hour = delivery_hour;
        this.transportist = transportist;
        this.delivery_time = delivery_time;
        this.avg_delivery_time = avg_delivery_time;
    }
}
