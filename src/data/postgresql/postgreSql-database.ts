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
    static async connect(options: Options) {
        const { user, host, database, password, port, ssl } = options;

        try {
            const pool = new pg.Pool({
                user,
                host,
                database,
                password,
                port,
                ssl,
            });
            const client = await pool.connect();
            client.release();
            console.log("Database connected");
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw error;
        }
    }
}
