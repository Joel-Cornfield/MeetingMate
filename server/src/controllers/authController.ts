import { Request, Response } from "express";
import { registerUser } from "../services/authService.js";

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