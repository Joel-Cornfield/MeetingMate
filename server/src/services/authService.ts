import prisma from "./prisma.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

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