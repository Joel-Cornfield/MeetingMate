import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_, res) => {
    res.json({
        message: "MeetingMate API running"
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});