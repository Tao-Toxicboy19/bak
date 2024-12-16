import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Define a custom type for your user
interface User {
    userId: number;
    name: string;
    role: string;
    group: number;
}

// Extend the Request type to include the user property
interface AuthRequest extends Request {
    user?: User;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).send("No token");
        }

        jwt.verify(token, "Toxicboy", (err, decoded: any) => {
            if (err) {
                console.error(err);
                return res.status(401).send("Token Invalid");
            }

            req.user = decoded.user;

            next();
        });
    } catch (err) {
        console.error(err);
        res.status(401).send("Token Invalid");
    }
};
