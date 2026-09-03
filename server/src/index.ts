import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import "./config/env.js";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

app.get("/", (_, res) => {
    res.json({
        message: "MeetingMate API running"
    });
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Audio file is too large. Maximum size is 50MB.",
            });
        }

        return res.status(400).json({
            message: err.message,
        });
    }

    if (err instanceof Error && err.message === "Only audio files are allowed") {
        return res.status(400).json({
            message: err.message,
        });
    }

    next(err);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});