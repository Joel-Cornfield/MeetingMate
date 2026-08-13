import dotenv from "dotenv";

dotenv.config();

// Enforce required variables at startup
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
};

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing");
};

// Export strictly typed constants
export const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
};