import dotenv from "dotenv";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { PostgreSQLDatabase } from "./data/postgresql/postgreSql-database";
import { envs } from "./config/envs";

(() => {
    main();
})();

async function main() {
    dotenv.config();

    await PostgreSQLDatabase.connect({
        user: envs.POSTGRESQL_DATABASE_USER_NAME,
        host: envs.POSTGRESQL_DATABASE_HOST,
        database: envs.POSTGRESQL_DATABASE_NAME,
        password: envs.POSTGRESQL_DATABASE_PASSWORD,
        port: envs.POSTGRESQL_DATABASE_PORT,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    }).start();
}
