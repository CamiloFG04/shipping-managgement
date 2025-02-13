import jwt from "jsonwebtoken";

export class JwtAdapter {
    static async generateToken(
        payload: object,
        duration: string = "2h"
    ): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET as string, // Asegurar que es string
                { expiresIn: duration as jwt.SignOptions["expiresIn"] }, // Convertir el tipo
                (err, token) => {
                    if (err) return resolve(null);
                    resolve(token!);
                }
            );
        });
    }
}
