import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Extends the default Express Request object to attach authenticated user state.
 */
export interface AuthRequest extends Request {
    userId?: string;
}

interface JwtPayload {
    userId: string;
}

/**
 * Express middleware to validate Bearer tokens and enforce route protection.
 * Extracts the JWT, verifies its signature, and injects the userId into the request payload.
 */
export function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    try {
        // Enforce JWT payload type runtime shape for TypeScript validation (explicitly tell TypeScript userId will be a string)
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload; 

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