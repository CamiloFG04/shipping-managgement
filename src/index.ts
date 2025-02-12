import dotenv from "dotenv";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
    main()
})()

async function main() {
    dotenv.config()

    new Server({
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
        routes: AppRoutes.routes
    }).start()
}