import express, { Router } from "express";
import { RedisAdapter } from "../config/redis";
import { setupSwagger } from "../swaggerConfig";

interface Options {
    port?: number;
    routes: Router;
}

export class Server {
    public readonly app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port = 3100, routes } = options;
        this.port = port;
        this.routes = routes;
    }

    async start() {
        await RedisAdapter.connect();
        setupSwagger(this.app);
        this.app.use(express.json());
        this.app.use(this.routes);
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
