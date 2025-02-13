import { Request, Response } from "express";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderDto } from "../../domain/dtos/orders/order.dto";

export class OrderController {
    constructor(private readonly authRepository: OrderRepository) {}

    store = (req: Request, res: Response) => {
        const [error, orderDto] = OrderDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }
    };
}
