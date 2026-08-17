import { Router } from "express";
import { create, getAll, getById, remove, upload } from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadAudio } from "../middleware/uploadsMiddleware.js";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.delete("/:id", authenticate, remove);
router.post("/:id/audio", authenticate, uploadAudio.single("audio"), upload);

export default router;