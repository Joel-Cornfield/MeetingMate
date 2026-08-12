import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
    userId?: string;
}

interface JwtPayload {
    userId: string;
}

export function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload; // explicitly tell TypeScript userId will be a string

        if (!decoded.userId) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.userId = decoded.userId;
        
        next();

    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}