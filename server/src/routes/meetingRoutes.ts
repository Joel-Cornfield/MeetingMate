import { Router } from "express";
import { create, getAll, getById } from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);

export default router;