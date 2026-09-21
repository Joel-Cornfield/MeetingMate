import dotenv from "dotenv";

dotenv.config();

// Enforce required variables at startup
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
};

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing");
};

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME environment variable is missing");
};

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY environment variable is missing");
};

if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET environment variable is missing");
};

// Export strictly typed constants
export const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};