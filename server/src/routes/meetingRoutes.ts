import { Router } from "express";
import { create, getAll } from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);

export default router;