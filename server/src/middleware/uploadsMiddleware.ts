import multer from "multer";

/**
 * Configure disk storage for incoming audio uploads.
 * Files are timestamped to prevent filename collisions in the destination directory.
 */
const storage = multer.diskStorage({
    destination: "uploads/audio",
    filename: (_req, file, cb) => {
        // Prepends timestamp to guarantee uniqueness
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

/**
 * Multer middleware instance for handling secure audio uploads.
 * Configured with strict type filtering and a 50MB maximum payload limit.
 */
const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    cb
) => {
    const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/webm",
        "audio/ogg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only audio file types are allowed"));
    }
};

export const uploadAudio = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB byte calculation
    }
})