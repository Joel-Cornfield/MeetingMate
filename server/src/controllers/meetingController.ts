import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { createMeeting, deleteMeeting, getMeetingById, getMeetings, attachAudio, getAudio, saveTranscript, getTranscript, saveSummary } from "../services/meetingService.js";
import { transcribeAudio } from "../services/transcriptionService.js";
import { generateMeetingSummary } from "../services/aiService.js";

/**
 * POST /api/meetings
 * Creates a new meeting for the authenticated user.
 */
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

/**
 * GET /api/meetings
 * Retrieves all meetings owned by the authenticated user, ordered by creation date.
 */
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

/**
 * GET /api/meetings/:id
 * Fetches a single meeting by its ID, ensuring it belongs to the active user.
 */
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

        return res.status(200).json({
            meeting,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * DELETE /api/meetings/:id
 * Safely deletes a meeting if it exists and belongs to the authenticated user.
 */
export async function remove(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authorization required",
            });
        }
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Meeting ID is required",
            });
        }

        const status = await deleteMeeting(id, req.userId);

        if (!status) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * POST /api/meetings/:id/audio
 * Adds an audio path to a meeting if it exists and belongs to the authenticated user
 */
export async function upload(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authorization required",
            });
        }
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Meeting ID is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Audio file is required",
            });
        }

        const meeting = await attachAudio(id, req.userId, req.file.path);

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        return res.status(200).json({
            meeting,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function transcribe(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authorization required",
            });
        }
        
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Meeting ID is required",
            });
        }

        const meeting = await getAudio(id, req.userId);

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        if (!meeting.audioPath) {
            return res.status(404).json({
                message: "Meeting does not have an audio file",
            });
        }

        const transcript = await transcribeAudio(meeting.audioPath);

        await saveTranscript(id, req.userId, transcript);

        return res.status(200).json({
            transcript,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function summarize(
    req: AuthRequest,
    res: Response
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Authorization required",
            });
        }
        
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Meeting ID is required",
            });
        }

        const meeting = await getTranscript(id, req.userId);

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        if (!meeting.transcript) {
            return res.status(404).json({
                message: "Meeting does not have a transcript",
            });
        }

        const result = await generateMeetingSummary(meeting.transcript);

        const saved = await saveSummary(id, req.userId, result.summary, result.actionItems);

        if (!saved) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        return res.status(200).json({
            meeting: saved,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}