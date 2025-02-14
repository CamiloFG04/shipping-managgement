import { Request, Response } from "express";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { CreateOrder } from "../../domain/use-cases/orders/create-order.use-case";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderAssignDto } from "../../domain/dtos/orders/orderAssign.dto";
import { AssignOrder } from "../../domain/use-cases/orders/assign-order.use-case";

export class OrderController {
    constructor(private readonly orderRepository: OrderRepository) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
        }
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    };

    store = (req: Request, res: Response) => {
        req.body.user_id = req.user.id;
        const [error, orderDto] = OrderDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        new CreateOrder(this.orderRepository)
            .execute(orderDto)
            .then((order) => {
                res.status(201).json({ success: true, order });
            })
            .catch((error) => this.handleError(error, res));
    };

    update = (req: Request, res: Response) => {
        const { id } = req.params;
        req.body.id = parseInt(id, 10);
        const [error, orderAssignDto] = OrderAssignDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        new AssignOrder(this.orderRepository)
            .execute(orderAssignDto)
            .then((order) => {
                res.status(201).json({ success: true, order });
            })
            .catch((error) => this.handleError(error, res));
    };
}
