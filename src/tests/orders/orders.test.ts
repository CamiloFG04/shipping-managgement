import request from "supertest";
import { Server } from "../../presentation/server";
import { AppRoutes } from "../../presentation/routes";
import { Express } from "express";
import { UserEntity } from "../../domain/entities/user.entity";
import { OrderDataSourceImpl } from "../../infrastructure/datasources/order.datasource.impl";
import { OrderRepositoryImpl } from "../../infrastructure/repositories/order.repository.impl";
import { Pool } from "pg";
import { OrderEntity } from "../../domain/entities/order.entity";
import { OrdersEntity } from "../../domain/entities/orders.entity";

// Mockeamos las dependencias
jest.mock("../../infrastructure/datasources/order.datasource.impl");
jest.mock("../../infrastructure/repositories/order.repository.impl");

jest.mock("pg", () => {
    return {
        Pool: jest.fn(() => {
            return {
                query: jest.fn(),
                end: jest.fn(),
            };
        }),
    };
});

jest.mock("../../data/postgresql/postgreSql-database", () => {
    return {
        PostgreSQLDatabase: {
            getPool: jest.fn(() => new Pool()), // Devuelve un pool mockeado
        },
    };
});

// Mockeamos los middlewares
jest.mock("../../presentation/middlewares/auth.middleware", () => ({
    AuthMiddleware: {
        validateToken: jest.fn((pool) => (req, res, next) => {
            req.user = { id: 1 };
            next();
        }),
    },
}));

jest.mock("../../presentation/middlewares/userRol.middleware", () => ({
    ValidateUserRolMiddleware: {
        validateUserRol: jest.fn((req, res, next) => next()),
    },
}));

jest.mock("../../presentation/middlewares/adminRol.middleware", () => ({
    ValidateAdminRolMiddleware: {
        validateAdminRol: jest.fn((req, res, next) => next()),
    },
}));

jest.mock("../../presentation/middlewares/address.middleware", () => ({
    validateAddressesMiddleware: {
        validateToken: jest.fn((req, res, next) => next()),
    },
}));

jest.mock("../../presentation/middlewares/order", () => ({
    OrderMiddleware: {
        validateOrderByID: jest.fn((pool) => (req, res, next) => next()),
        validateOrderByTrackingCode: jest.fn(
            (pool) => (req, res, next) => next()
        ),
        validateCloseOrderByTrackingCode: jest.fn(
            (pool) => (req, res, next) => next()
        ),
    },
}));

jest.mock("../../presentation/middlewares/transporter", () => ({
    TransporterMiddleware: {
        validateTransporter: jest.fn((pool) => (req, res, next) => next()), // Simula que el middleware pasa
    },
}));

describe("Order  Routes", () => {
    let app: Express;
    let server: Server;
    beforeAll(async () => {
        // Mockeamos las respuestas de AuthDataSourceImpl
        const mockOrder: OrderEntity = {
            id: 1,
            user_id: 1,
            tracking_code: "TRKM76HMQQI",
            package_weight: 15.2,
            package_dimensions: "50x40x35 cm",
            product_type: "Furniture",
            origin_address: "Diagonal 30 #40-60, Cartagena",
            recipient_name: "Mariana Torres",
            recipient_phone: "3228765432",
            recipient_identification: "1098765432",
            destination_address: "Carrera 8 #16-20, Cartagena",
            status: "On hold",
            assigned_at: null,
            delivery_at: null,
            transporter_id: null,
        };

        const mockOrders: OrdersEntity[] = [
            {
                id: 2,
                status: "In transit",
                tracking_number: "ADQFADSQSDA",
                pickup_date: new Date("2025-02-15"),
                delivery_date: null,
                delivery_hour: null,
                pickup_hour: "03:09:16",
                transportist: "Carlos Pérez",
                delivery_time: null,
                avg_delivery_time: null,
            },
            {
                id: 2,
                status: "In transit",
                tracking_number: "ADQFADSQSDA",
                pickup_date: new Date("2025-02-15"),
                delivery_date: null,
                delivery_hour: null,
                pickup_hour: "03:09:16",
                transportist: "Carlos Pérez",
                delivery_time: null,
                avg_delivery_time: null,
            },
        ];

        OrderDataSourceImpl.prototype.store = jest
            .fn()
            .mockResolvedValue(mockOrder);

        OrderDataSourceImpl.prototype.update = jest
            .fn()
            .mockResolvedValue(mockOrder);

        OrderDataSourceImpl.prototype.getOrderDetail = jest
            .fn()
            .mockResolvedValue(mockOrder);
        OrderDataSourceImpl.prototype.closeOrder = jest
            .fn()
            .mockResolvedValue(mockOrder);
        OrderDataSourceImpl.prototype.orders = jest
            .fn()
            .mockResolvedValue(mockOrders);

        OrderRepositoryImpl.prototype.store = jest
            .fn()
            .mockImplementation((OrderDto) => {
                return Promise.resolve(mockOrder);
            });

        OrderRepositoryImpl.prototype.update = jest
            .fn()
            .mockImplementation((OrderAssignDto) => {
                return Promise.resolve(mockOrder);
            });
        OrderRepositoryImpl.prototype.getOrderDetail = jest
            .fn()
            .mockImplementation((OrderDetailDto) => {
                return Promise.resolve(mockOrder);
            });
        OrderRepositoryImpl.prototype.closeOrder = jest
            .fn()
            .mockImplementation((OrderDetailDto) => {
                return Promise.resolve(mockOrder);
            });
        OrderRepositoryImpl.prototype.orders = jest
            .fn()
            .mockImplementation((OrdersDto) => {
                return Promise.resolve(mockOrders);
            });

        server = new Server({
            port: 3200,
            routes: AppRoutes.routes,
        });
        app = server.app;
        await server.start();
    });

    describe("POST /api/orders", () => {
        it("should create a new order", async () => {
            const response = await request(app).post("/api/orders").send({
                package_weight: 15.2,
                package_dimensions: "50x40x35 cm",
                product_type: "Furniture",
                origin_address: "Diagonal 30 #40-60, Cartagena",
                recipient_name: "Mariana Torres",
                recipient_phone: "3228765432",
                recipient_identification: "1098765432",
                destination_address: "Carrera 8 #16-20, Cartagena",
            });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.order).toBeDefined();
        });
    });

    describe("PUT /api/orders/:id/assign-transporter", () => {
        it("should assign a transporter to an order", async () => {
            const response = await request(app)
                .put("/api/orders/1/assign-transporter")
                .send({
                    transporter_id: 1,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.order).toBeDefined();
        });
    });

    describe("GET /api/orders/code-tracking/code-tracking-detail", () => {
        it("should get order details by tracking code", async () => {
            const response = await request(app)
                .get("/api/orders/code-tracking/code-tracking-detail")
                .query({ tracking_code: "ABC123" });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.order).toBeDefined();
        });
    });

    describe("PUT /api/orders/:tracking_code/close-order", () => {
        it("should close an order by tracking code", async () => {
            const response = await request(app)
                .put("/api/orders/ABC123/close-order")
                .send({
                    status: "closed",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.order).toBeDefined();
        });
    });

    describe("GET /api/orders", () => {
        it("should get all orders", async () => {
            const response = await request(app).get("/api/orders");
            console.log(response.error);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.orders).toBeDefined();
        });
    });
});
