import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { envs } from "../../config/envs";

export class validateAddressesMiddleware {
    static validateToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { origin_address, destination_address } = req.body;

        try {
            const [originResponse, destinationResponse] = await Promise.all([
                axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                    params: {
                        address: origin_address,
                        key: envs.GOOGLE_MAPS_KEY,
                    },
                }),
                axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                    params: {
                        address: destination_address,
                        key: envs.GOOGLE_MAPS_KEY,
                    },
                }),
            ]);

            if (originResponse.data.status !== "OK") {
                res.status(400).json({
                    success: false,
                    error: "Invalid origin address",
                });
                return;
            }

            if (destinationResponse.data.status !== "OK") {
                res.status(400).json({
                    success: false,
                    error: "Invalid destination address",
                });
                return;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: "Error validating addresses",
            });
        }
    };
}
