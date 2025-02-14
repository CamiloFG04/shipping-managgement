import { createClient, RedisClientType } from "redis";
import { CustomError } from "../domain/errors/custom.error";

export class RedisAdapter {
    private static client: RedisClientType | null = null;

    static async connect() {
        if (this.client) return this.client; // Si ya está conectado, retorna el cliente

        try {
            this.client = createClient({
                url: "redis://localhost:6379",
            });

            this.client.on("error", (err) => {
                throw CustomError.internalServerError(
                    "Please start the redis instance."
                );
            });

            await this.client.connect();
            console.log("✅ Redis connected successfully");

            return this.client;
        } catch (error) {
            console.error("❌ Error connecting to Redis:", error);
            this.client = null;
        }
    }

    static getClient() {
        return this.client;
    }
}
