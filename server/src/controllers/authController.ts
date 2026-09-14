import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import prisma from "../services/prisma.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * POST /api/auth/register
 * Registers a new user account and creates an authenticated session.
 */
export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await registerUser(
            email,
            password
        );

        res.cookie(
            "token",
            result.token,
            COOKIE_OPTIONS
        );

        return res.status(201).json({
            user: result.user,
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
 * Logs in an existing user and stores the JWT in an HttpOnly cookie.
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

        res.cookie(
            "token",
            result.token,
            COOKIE_OPTIONS,
        );

        return res.status(200).json({
            user: result.user,
        });
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
 * Fetches the currently authenticated user's profile, explicitly omitting sensitive security fields.
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

/**
 * POST /api/auth/logout
 * Logs out the user by clearing the authentication JWT cookie.
 */
export async function logout(
    req: Request,
    res: Response
) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logged out successfully",
    });
}