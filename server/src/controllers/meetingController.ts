import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { createMeeting } from "../services/meetingService.js";

export async function create(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Meeting title is required",
            });
        }
            
        const meeting = await createMeeting(req.userId, title);

        return res.status(201).json({
            meeting,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}