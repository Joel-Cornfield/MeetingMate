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
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedTypes = new Set([
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/webm",
        "audio/ogg",
        "audio/mp3",
        "audio/mpeg3",
        "audio/x-mpeg-3",
    ]);

    if (allowedTypes.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`LIMIT_UNSUPPORTED_FILE_TYPE: ${file.mimetype}`));
    }
};

export const uploadAudio = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB byte calculation
    }
})