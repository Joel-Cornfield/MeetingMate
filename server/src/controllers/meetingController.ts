import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { createMeeting, getMeetingById, getMeetings } from "../services/meetingService.js";

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

export async function getAll(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const meetings = await getMeetings(req.userId);

        return res.status(200).json({
            meetings,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getById(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Meeting ID is required",
            });
        }

        const meeting = await getMeetingById(id, req.userId);

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        res.status(200).json({
            meeting,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}