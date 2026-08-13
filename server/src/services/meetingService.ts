import prisma from "./prisma.js";

export async function createMeeting(
    userId: string,
    title: string
) {
    return prisma.meeting.create({
        data: {
            title, 
            userId,
        },
    });
}