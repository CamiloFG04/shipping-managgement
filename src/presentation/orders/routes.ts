import { Router } from "express";
import { OrderController } from "./controller";
import { PostgreSQLDatabase } from "../../data/postgresql/postgreSql-database";
import { OrderDataSourceImpl } from "../../infrastructure/datasources/order.datasource.impl";
import { OrderRepositoryImpl } from "../../infrastructure/repositories/order.repository.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validateAddressesMiddleware } from "../middlewares/address.middleware";
import { ValidateUserRolMiddleware } from "../middlewares/userRol.middleware";
import { ValidateAdminRolMiddleware } from "../middlewares/adminRol.middleware";
import { TransporterMiddleware } from "../middlewares/transporter";
import { OrderMiddleware } from "../middlewares/order";

export class OrderRoutes {
    static get routes(): Router {
        const router = Router();
        const pool = PostgreSQLDatabase.getPool();
        const dataSource = new OrderDataSourceImpl(pool);
        const orderRepository = new OrderRepositoryImpl(dataSource);
        const controller = new OrderController(orderRepository);

        router.post(
            "/",
            /**
             * @swagger
             * /api/orders:
             *   post:
             *     summary: Create a new order
             *     tags: [Orders]
             *     security:
             *       - bearerAuth: []
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             required:
             *               - package_weight
             *               - package_dimensions
             *               - product_type
             *               - origin_address
             *               - recipient_name
             *               - recipient_phone
             *               - recipient_identification
             *               - destination_address
             *             properties:
             *               package_weight:
             *                 type: integer
             *                 example: 15.2
             *               package_dimensions:
             *                 type: string
             *                 example: "50x40x35 cm"
             *               product_type:
             *                 type: string
             *                 example: "Furniture"
             *               origin_address:
             *                 type: string
             *                 example: "Diagonal 30 #40-60, Cartagena"
             *               recipient_name:
             *                 type: string
             *                 example: "Mariana Torres"
             *               recipient_phone:
             *                 type: string
             *                 example: "3228765432"
             *               recipient_identification:
             *                 type: string
             *                 example: "1098765432"
             *               destination_address:
             *                 type: string
             *                 example: "Carrera 8 #16-20, Cartagena"
             *     responses:
             *       201:
             *         description: Order created successfully
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Order created successfully"
             *                 user:
             *                   type: object
             *                   properties:
             *                     id:
             *                       type: integer
             *                       example: 1
             *                     user_id:
             *                       type: integer
             *                       example: 1
             *                     tracking_code:
             *                       type: string
             *                       example: "TRKM76HMQQI"
             *                     package_weight:
             *                       type: string
             *                       example: "15.20"
             *                     package_dimensions:
             *                       type: string
             *                       example: "50x40x35 cm"
             *                     product_type:
             *                       type: string
             *                       example: "Furniture"
             *                     origin_address:
             *                       type: string
             *                       example: "Diagonal 30 #40-60, Cartagena"
             *                     recipient_name:
             *                       type: string
             *                       example: "Mariana Torres"
             *                     recipient_phone:
             *                       type: string
             *                       example: "3228765432"
             *                     recipient_identification:
             *                       type: string
             *                       example: "1098765432"
             *                     destination_address:
             *                       type: string
             *                       example: "Carrera 8 #16-20, Cartagena"
             *                     status:
             *                       type: string
             *                       example: "On hold"
             *                     transporter_id:
             *                       type: string
             *                       example: null
             *                     assigned_at:
             *                       type: string
             *                       example: null
             *                     delivery_at:
             *                       type: string
             *                       example: null
             *       401:
             *         description: Unauthorized
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Unauthorized"
             *       403:
             *         description: Forbidden
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Forbidden: only users can perform this action"
             *       400:
             *         description: Invalid data or invalid origin or destination address
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Invalid destination address"
             *       500:
             *         description: Internal server error
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Internal server error"
             */
            AuthMiddleware.validateToken(pool),
            ValidateUserRolMiddleware.validateUserRol,
            validateAddressesMiddleware.validateToken,
            controller.store
        );

        router.put(
            "/:id/assign-transporter",
            /**
             * @swagger
             * /api/orders/{id}/assign-transporter:
             *   put:
             *     summary: Assign a transporter to an order
             *     tags: [Orders]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *         description: Order ID to assign a transporter.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             required:
             *               - transporter_id
             *             properties:
             *               transporter_id:
             *                 type: integer
             *                 example: 3
             *     responses:
             *       200:
             *         description: Order created successfully
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Order assigned successfully"
             *                 user:
             *                   type: object
             *                   properties:
             *                     id:
             *                       type: integer
             *                       example: 1
             *                     user_id:
             *                       type: integer
             *                       example: 1
             *                     tracking_code:
             *                       type: string
             *                       example: "TRKM76HMQQI"
             *                     package_weight:
             *                       type: string
             *                       example: "15.20"
             *                     package_dimensions:
             *                       type: string
             *                       example: "50x40x35 cm"
             *                     product_type:
             *                       type: string
             *                       example: "Furniture"
             *                     origin_address:
             *                       type: string
             *                       example: "Diagonal 30 #40-60, Cartagena"
             *                     recipient_name:
             *                       type: string
             *                       example: "Mariana Torres"
             *                     recipient_phone:
             *                       type: string
             *                       example: "3228765432"
             *                     recipient_identification:
             *                       type: string
             *                       example: "1098765432"
             *                     destination_address:
             *                       type: string
             *                       example: "Carrera 8 #16-20, Cartagena"
             *                     status:
             *                       type: string
             *                       example: "In transit"
             *                     transporter_id:
             *                       type: integer
             *                       example: 3
             *                     assigned_at:
             *                       type: string
             *                       example: "2025-02-15T23:36:43.056Z"
             *                     delivery_at:
             *                       type: string
             *                       example: null
             *       401:
             *         description: Unauthorized
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Unauthorized"
             *       403:
             *         description: Forbidden
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Forbidden: Insufficient permissions"
             *       400:
             *         description: Invalid data or invalid origin or destination address
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Invalid destination address"
             *       404:
             *         description: Order not found or transporter not found
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Order not found"
             *       409:
             *         description: The order has already been delivered or already has a transporter or transporter is not available
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "This order has already been delivered and cannot be updated"
             *       500:
             *         description: Internal server error
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Internal server error"
             */
            AuthMiddleware.validateToken(pool),
            ValidateAdminRolMiddleware.validateAdminRol,
            OrderMiddleware.validateOrderByID(pool),
            TransporterMiddleware.validateTransporter(pool),
            controller.update
        );

        router.get(
            "/code-tracking/code-tracking-detail",
            /**
             * @swagger
             * /api/orders/code-tracking/code-tracking-detail:
             *   get:
             *     summary: Get order details by tracking code
             *     tags: [Orders]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: query
             *         name: tracking_code
             *         required: true
             *         schema:
             *           type: string
             *         description: Tracking code of the order.
             *     responses:
             *       200:
             *         description: Order details
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 user:
             *                   type: object
             *                   properties:
             *                     tracking_code:
             *                       type: string
             *                       example: "TRKM76HMQQI"
             *                     package_weight:
             *                       type: string
             *                       example: "15.20"
             *                     package_dimensions:
             *                       type: string
             *                       example: "50x40x35 cm"
             *                     product_type:
             *                       type: string
             *                       example: "Furniture"
             *                     origin_address:
             *                       type: string
             *                       example: "Diagonal 30 #40-60, Cartagena"
             *                     recipient_name:
             *                       type: string
             *                       example: "Mariana Torres"
             *                     recipient_phone:
             *                       type: string
             *                       example: "3228765432"
             *                     recipient_identification:
             *                       type: string
             *                       example: "1098765432"
             *                     destination_address:
             *                       type: string
             *                       example: "Carrera 8 #16-20, Cartagena"
             *                     status:
             *                       type: string
             *                       example: "In transit"
             *                     user_name:
             *                       type: string
             *                       example: "Camilo Fernandez"
             *                     user_phone:
             *                       type: string
             *                       example: "3134633830"
             *                     user_identification:
             *                       type: string
             *                       example: "1026304241"
             *                     transporter_name:
             *                       type: string
             *                       example: "Juan González"
             *                     transporter_identification:
             *                       type: string
             *                       example: "1021445327"
             *                     assigned_at:
             *                       type: string
             *                       example: "2025-02-15T23:36:43.056Z"
             *                     delivery_at:
             *                       type: string
             *                       example: null
             *       400:
             *         description: Invalid data
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Missing tracking code"
             *       404:
             *         description: Order not found
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "The consulted guide was not found"
             *       500:
             *         description: Internal server error
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Internal server error"
             */
            AuthMiddleware.validateToken(pool),
            OrderMiddleware.validateOrderByTrackingCode(pool),
            controller.getOrderDetail
        );

        router.put(
            "/:tracking_code/close-order",
            /**
             * @swagger
             * /api/orders/{id}/close-order:
             *   put:
             *     summary: End the order by delivering it
             *     tags: [Orders]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: tracking_code
             *         required: true
             *         schema:
             *           type: String
             *         description: Tracking code to close the order
             *     responses:
             *       200:
             *         description: Order delivered
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Order assigned successfully"
             *                 user:
             *                   type: object
             *                   properties:
             *                     id:
             *                       type: integer
             *                       example: 1
             *                     user_id:
             *                       type: integer
             *                       example: 1
             *                     tracking_code:
             *                       type: string
             *                       example: "TRKM76HMQQI"
             *                     package_weight:
             *                       type: string
             *                       example: "15.20"
             *                     package_dimensions:
             *                       type: string
             *                       example: "50x40x35 cm"
             *                     product_type:
             *                       type: string
             *                       example: "Furniture"
             *                     origin_address:
             *                       type: string
             *                       example: "Diagonal 30 #40-60, Cartagena"
             *                     recipient_name:
             *                       type: string
             *                       example: "Mariana Torres"
             *                     recipient_phone:
             *                       type: string
             *                       example: "3228765432"
             *                     recipient_identification:
             *                       type: string
             *                       example: "1098765432"
             *                     destination_address:
             *                       type: string
             *                       example: "Carrera 8 #16-20, Cartagena"
             *                     status:
             *                       type: string
             *                       example: "Delivered"
             *                     transporter_id:
             *                       type: integer
             *                       example: 3
             *                     assigned_at:
             *                       type: string
             *                       example: "2025-02-15T23:36:43.056Z"
             *                     delivery_at:
             *                       type: string
             *                       example: "2025-02-15T23:58:14.269Z"
             *       401:
             *         description: Unauthorized
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Unauthorized"
             *       403:
             *         description: Forbidden
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Forbidden: Insufficient permissions"
             *       400:
             *         description: Invalid data
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Missing tracking code"
             *       404:
             *         description: Order not found
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "The consulted guide was not found"
             *       500:
             *         description: Internal server error
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Internal server error"
             */
            AuthMiddleware.validateToken(pool),
            ValidateAdminRolMiddleware.validateAdminRol,
            OrderMiddleware.validateCloseOrderByTrackingCode(pool),
            controller.closeOrder
        );

        router.get(
            "/",
            /**
             * @swagger
             * /api/orders:
             *   get:
             *     summary: Get orders with metrics
             *     tags: [Orders]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: query
             *         name: startDate
             *         required: false
             *         schema:
             *           type: String
             *         description: Date when it entered transit
             *       - in: query
             *         name: endDate
             *         required: false
             *         schema:
             *           type: String
             *         description: Date when it was delivered.
             *       - in: query
             *         name: status
             *         required: false
             *         schema:
             *           type: String
             *         description: Order status
             *       - in: query
             *         name: transporter
             *         required: false
             *         schema:
             *           type: integer
             *         description: Transporter ID
             *     responses:
             *       200:
             *         description: Order delivered
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 orders:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       id:
             *                         type: integer
             *                         example: 2
             *                       status:
             *                         type: string
             *                         example: "Delivered"
             *                       pickup_date:
             *                         type: string
             *                         format: date
             *                         example: "2025-02-13"
             *                       delivery_date:
             *                         type: string
             *                         format: date
             *                         nullable: true
             *                         example: "2025-02-15"
             *                       delivery_hour:
             *                         type: string
             *                         format: time
             *                         nullable: true
             *                         example: "03:58:26"
             *                       pickup_hour:
             *                         type: string
             *                         format: time
             *                         example: "03:09:16"
             *                       transportist:
             *                         type: string
             *                         example: "Carlos Pérez"
             *                       delivery_time:
             *                         type: string
             *                         nullable: true
             *                         example: "48.01"
             *                         description: "Total time taken to complete the delivery"
             *                       avg_delivery_time:
             *                         type: string
             *                         nullable: true
             *                         example: "16.28"
             *                         description: "Average estimated delivery time for the orders"
             *       401:
             *         description: Unauthorized
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Unauthorized"
             *       403:
             *         description: Forbidden
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: false
             *                 message:
             *                   type: string
             *                   example: "Forbidden: Insufficient permissions"
             *       500:
             *         description: Internal server error
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 message:
             *                   type: string
             *                   example: "Internal server error"
             */
            AuthMiddleware.validateToken(pool),
            ValidateAdminRolMiddleware.validateAdminRol,
            controller.getOrders
        );

        return router;
    }
}
