import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import prisma from "../services/prisma.js";

/**
 * POST /api/auth/register
 * Registers a new user account in the system.
 */
export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await registerUser(email, password);

        return res.status(200).json({
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "User already exists"
        ) {
            return res.status(400).json({
                message: error.message,
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * POST /api/auth/login
 * Logs in an existing user and returns an authentication payload.
 */
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginUser(email, password);

        return res.status(200).json(result);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Invalid email or password"
        ) {
            return res.status(400).json({
                message: error.message,
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * GET /api/auth/me
 * Fetches the active user's profile, explicitly omitting sensitive security fields.
 */
export async function getCurrentUser(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authentication Required",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}