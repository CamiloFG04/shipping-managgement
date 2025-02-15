import { Request, Response } from "express";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderDto } from "../../domain/dtos/orders/order.dto";
import { CreateOrder } from "../../domain/use-cases/orders/create-order.use-case";
import { CustomError } from "../../domain/errors/custom.error";
import { OrderAssignDto } from "../../domain/dtos/orders/orderAssign.dto";
import { AssignOrder } from "../../domain/use-cases/orders/assign-order.use-case";
import { OrderDetail } from "../../domain/use-cases/orders/order-detail.use-case";
import { OrderDetailDto } from "../../domain/dtos/orders/orderDetail.dto";
import { CloseOrder } from "../../domain/use-cases/orders/close-order.use-case";
import { OrdersDto } from "../../domain/dtos/orders/orders.dto";
import { OrdersDetail } from "../../domain/use-cases/orders/get-orders.use-case";

export class OrderController {
    constructor(private readonly orderRepository: OrderRepository) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    };

    store = (req: Request, res: Response) => {
        req.body.user_id = req.user.id;
        const [error, orderDto] = OrderDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new CreateOrder(this.orderRepository)
            .execute(orderDto)
            .then((order) => {
                res.status(201).json({
                    success: true,
                    order,
                    message: "Order created successfully",
                });
            })
            .catch((error) => this.handleError(error, res));
    };

    update = (req: Request, res: Response) => {
        const { id } = req.params;
        req.body.id = parseInt(id, 10);
        const [error, orderAssignDto] = OrderAssignDto.create(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new AssignOrder(this.orderRepository)
            .execute(orderAssignDto)
            .then((order) => {
                res.status(200).json({
                    success: true,
                    order,
                    message: "Order assigned successfully",
                });
            })
            .catch((error) => this.handleError(error, res));
    };

    getOrderDetail = (req: Request, res: Response) => {
        const { tracking_code } = req.query;

        const [error, orderDetailDto] = OrderDetailDto.create({
            tracking_code,
        });

        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new OrderDetail(this.orderRepository)
            .execute(orderDetailDto)
            .then((order) => {
                res.status(200).json({ success: true, order });
            })
            .catch((error) => this.handleError(error, res));
    };

    closeOrder = (req: Request, res: Response) => {
        const [error, orderAssignDto] = OrderDetailDto.create(req.params);
        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new CloseOrder(this.orderRepository)
            .execute(orderAssignDto)
            .then((order) => {
                res.status(200).json({
                    success: true,
                    order,
                    message: "Order delivered",
                });
            })
            .catch((error) => this.handleError(error, res));
    };

    getOrders = (req: Request, res: Response) => {
        const [error, ordersDto] = OrdersDto.create(req.query);

        if (error) {
            res.status(400).json({ success: false, message: error });
            return;
        }

        new OrdersDetail(this.orderRepository)
            .execute(ordersDto)
            .then((orders) => {
                res.status(200).json({ success: true, orders });
            })
            .catch((error) => this.handleError(error, res));
    };
}
