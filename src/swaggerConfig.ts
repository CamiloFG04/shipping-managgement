import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shipping Managemment API",
            version: "1.0.0",
            description: "Documentation of my API with Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        "src/presentation/auth/routes.ts",
        "src/presentation/orders/routes.ts",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
