import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} environment variable is missing`);
    }

    return value;
}

// Enforce required variables at startup
const JWT_SECRET = getRequiredEnv("JWT_SECRET");
const DATABASE_URL = getRequiredEnv("DATABASE_URL");
const CLOUDINARY_CLOUD_NAME = getRequiredEnv("CLOUDINARY_CLOUD_NAME");
const CLOUDINARY_API_KEY = getRequiredEnv("CLOUDINARY_API_KEY");
const CLOUDINARY_API_SECRET = getRequiredEnv("CLOUDINARY_API_SECRET");
const GEMINI_API_KEY=getRequiredEnv("GEMINI_API_KEY");

// Export strictly typed constants
export const env = {
    JWT_SECRET,
    DATABASE_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    GEMINI_API_KEY,
};