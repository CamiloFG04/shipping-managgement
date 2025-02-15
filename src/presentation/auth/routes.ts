import { Router } from "express";
import { AutController } from "./controller";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { AuthDataSourceImpl } from "../../infrastructure/datasources/auth.datasource.impl";
import { PostgreSQLDatabase } from "../../data/postgresql/postgreSql-database";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const pool = PostgreSQLDatabase.getPool();
        const dataSource = new AuthDataSourceImpl(pool);
        const authRepository = new AuthRepositoryImpl(dataSource);
        const controller = new AutController(authRepository);

        router.post(
            "/register",
            /**
             * @swagger
             * /api/auth/register:
             *   post:
             *     summary: Register a new user
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             required:
             *               - name
             *               - email
             *               - password
             *               - phone
             *               - identification
             *             properties:
             *               name:
             *                 type: string
             *                 example: "Camilo Fernandez"
             *               email:
             *                 type: string
             *                 example: "camilo.fernandez@gmail.com"
             *               password:
             *                 type: string
             *                 example: "Qwerty123*"
             *               phone:
             *                 type: string
             *                 example: "3134739201"
             *               identification:
             *                 type: string
             *                 example: "1026378291"
             *     responses:
             *       201:
             *         description: Successfully registered user
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
             *                   example: "Successfully registered user"
             *                 user:
             *                   type: object
             *                   properties:
             *                     id:
             *                       type: integer
             *                       example: 1
             *                     name:
             *                       type: string
             *                       example: "Camilo Fernandez"
             *                     email:
             *                       type: string
             *                       example: "camilo.fernandez@gmail.com"
             *                     role:
             *                       type: string
             *                       example: "user"
             *       400:
             *         description: Invalid data or already registered user
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
             *                   example: "User is already registered"
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
            controller.registerUser
        );
        router.post(
            "/login",
            /**
             * @swagger
             * /api/auth/login:
             *   post:
             *     summary: Login user
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             required:
             *               - email
             *               - password
             *             properties:
             *               email:
             *                 type: string
             *                 example: "camilo.fernandez@gmail.com"
             *               password:
             *                 type: string
             *                 example: "Qwerty123*"
             *     responses:
             *       200:
             *         description: Successful login
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 success:
             *                   type: boolean
             *                   example: true
             *                 token:
             *                   type: string
             *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM5NjM5MjIyLCJleHAiOjE3Mzk2NDY0MjJ9.h0RPF8yEU3bWvBqZbLy8NcrTk7Z9-TaVBeBJv92SJOI"
             *       400:
             *         description: Invalid data or user not found
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
             *                   example: "User not found"
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
            controller.loginUser
        );

        return router;
    }
}
