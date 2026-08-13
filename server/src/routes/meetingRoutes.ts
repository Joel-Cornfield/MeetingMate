import { Router } from "express";
import { create } from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, create);

export default router;