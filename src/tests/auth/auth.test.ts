import request from "supertest";
import { Server } from "../../presentation/server";
import { AppRoutes } from "../../presentation/routes";
import { Express } from "express";
import { UserEntity } from "../../domain/entities/user.entity";
import { AuthDataSourceImpl } from "../../infrastructure/datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { Pool } from "pg";

// Mockeamos las dependencias
jest.mock("../../infrastructure/datasources/auth.datasource.impl");
jest.mock("../../infrastructure/repositories/auth.repository.impl");

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

describe("Auth Routes", () => {
    let app: Express;
    let server;
    beforeAll(async () => {
        // Mockeamos las respuestas de AuthDataSourceImpl
        const mockUser: UserEntity = {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
            phone: "1234567890",
            identification: "123456789",
            role: "user",
        };

        AuthDataSourceImpl.prototype.register = jest
            .fn()
            .mockResolvedValue(mockUser);

        AuthDataSourceImpl.prototype.login = jest
            .fn()
            .mockResolvedValue(mockUser);

        // Mockeamos AuthRepositoryImpl para usar AuthDataSourceImpl mockeado
        AuthRepositoryImpl.prototype.register = jest
            .fn()
            .mockImplementation((registerDto) => {
                return Promise.resolve(mockUser);
            });

        AuthRepositoryImpl.prototype.login = jest
            .fn()
            .mockImplementation((loginDto) => {
                return Promise.resolve(mockUser);
            });

        const server = new Server({
            port: 3100,
            routes: AppRoutes.routes,
        });
        app = server.app;
        await server.start();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password: "Password123!",
                    phone: "1234567890",
                    identification: "123456789",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toBeDefined();
        });

        it("should return 400 if data is invalid", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "", // Nombre vacío
                    email: "invalid-email", // Correo inválido
                    password: "123", // Contraseña inválida
                    phone: "", // Teléfono vacío
                    identification: "", // Identificación vacía
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBeDefined();
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login a user and return a token", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123!",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        // it("should return 401 if credentials are incorrect", async () => {
        //     // Mockeamos un error de credenciales incorrectas
        //     AuthRepositoryImpl.prototype.login = jest
        //         .fn()
        //         .mockRejectedValue(new Error("Unauthorized"));

        //     const response = await request(app).post("/api/auth/login").send({
        //         email: "john.doe@example.com",
        //         password: "WrongPassword123!",
        //     });

        //     console.log(response.body); // Para depuración

        //     expect(response.status).toBe(401);
        //     expect(response.body.success).toBe(false);
        //     expect(response.body.message).toBe("Unauthorized");
        // });

        it("should return 400 if data is invalid", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: "invalid-email", // Correo inválido
                password: "", // Contraseña vacía
            });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBeDefined();
        });
    });
});
