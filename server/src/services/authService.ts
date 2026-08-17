import prisma from "./prisma.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Validates, hashes credentials, and creates a new user record.
 * @param email - Unique email address to register
 * @param password - Plaintext password provided by client
 * @returns Sanitized user profile data (omitting the password hash)
 * @throws {Error} "User already exists" if the email is taken
 */
export async function registerUser(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email, 
        }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
    });

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
    };
}

/**
 * Verifies user credentials and issues a signed JSON Web Token (JWT).
 * @param email - The user's account email
 * @param password - Plaintext login attempt password
 * @returns Auth payload containing a bearer token and sanitized user profile
 * @throws {Error} "Invalid email or password" for failed verification steps
 */
export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
}