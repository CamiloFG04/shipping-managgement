import "dotenv/config";
import { get } from "env-var";

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    POSTGRESQL_DATABASE_HOST: get("POSTGRESQL_DATABASE_HOST").asString(),
    POSTGRESQL_DATABASE_PORT: get("POSTGRESQL_DATABASE_PORT").asPortNumber(),
    POSTGRESQL_DATABASE_NAME: get("POSTGRESQL_DATABASE_NAME").asString(),
    POSTGRESQL_DATABASE_USER_NAME: get(
        "POSTGRESQL_DATABASE_USER_NAME"
    ).asString(),
    POSTGRESQL_DATABASE_PASSWORD: get(
        "POSTGRESQL_DATABASE_PASSWORD"
    ).asString(),

    JWT_SECRET: get("JWT_SECRET").required().asString(),
    GOOGLE_MAPS_KEY: get("GOOGLE_MAPS_KEY").required().asString(),
};
