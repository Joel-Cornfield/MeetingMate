import multer from "multer";

/**
 * Configure Multer to keep uploaded audio files in memory.
 * 
 * The file is then directly uploaded to cloudinary by the controller.
 */
const storage = multer.memoryStorage();

/**
 * Multer middleware instance for handling secure audio uploads.
 * Configured with strict type filtering and a 50MB maximum payload limit.
 */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedMimeTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/webm",
        "audio/ogg",
        "audio/mp3",
        "audio/mpeg3",
        "audio/x-mpeg-3",
    ];

    const allowedExtensions = [
        ".mp3",
        ".wav",
        ".m4a",
        ".webm",
        ".ogg",
        ".aac",
        ".flac",
    ];

    const lowerName = file.originalname.toLowerCase();
    const extension = lowerName.includes(".")
        ? lowerName.slice(lowerName.lastIndexOf("."))
        : "";
        
    if (
        allowedMimeTypes.includes(file.mimetype) ||
        (
            file.mimetype === "application/octet-stream" &&
            allowedExtensions.includes(extension)
        )
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only audio files are allowed"));
    }
};

export const uploadAudio = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB byte calculation
    }
})