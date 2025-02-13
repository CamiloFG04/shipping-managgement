import pg from "pg";

interface Options {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
    ssl: { rejectUnauthorized: boolean };
}

export class PostgreSQLDatabase {
    private static pool: pg.Pool;

    static async connect(options: Options) {
        const { user, host, database, password, port, ssl } = options;
        try {
            if (!this.pool) {
                this.pool = new pg.Pool({
                    user,
                    host,
                    database,
                    password,
                    port,
                    ssl,
                });
            }
            const client = await this.pool.connect();
            client.release();
            console.log("Database connected");
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw error;
        }
    }

    static getPool(): pg.Pool {
        if (!this.pool) {
            throw new Error("Database connection not initialized");
        }
        return this.pool;
    }
}
