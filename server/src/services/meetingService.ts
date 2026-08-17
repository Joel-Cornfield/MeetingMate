import prisma from "./prisma.js";

/**
 * Inserts a new meeting record into the database.
 * @param userId - Unique identifier of the meeting organizer
 * @param title - The headline or name of the meeting
 */
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

/**
 * Fetches all records tied to a specific user, sorted from newest to oldest.
 * @param userId - The owner's unique user ID
 */
export async function getMeetings(
    userId: string
) {
    return prisma.meeting.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Finds a specific meeting record, strictly scoped to its owner.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user (prevents cross-user data leaks)
 */
export async function getMeetingById(
    meetingId: string,
    userId: string
) { 
    return prisma.meeting.findFirst({
        where: {
            userId, 
            id: meetingId,
        },
    });
}

/**
 * Validates ownership and permanently removes a meeting record.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @returns The deleted meeting record, or null if the meeting wasn't found/authorized
 */
export async function deleteMeeting(
    meetingId: string,
    userId: string
) { 
    // First query ensures the target resource belongs strictly to the active user
    const meeting = await prisma.meeting.findFirst({
        where: {
            userId, 
            id: meetingId,
        },
    });

    if (!meeting) {
        return null;
    }

    return prisma.meeting.delete({
        where: {
            id: meetingId,
        },
    });
}

/**
 * Validations ownership and attaches a path to an audio file to the requested meeting
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @param audioPath - The path to the uploaded audio file
 * @returns The updated meeting object with the new audioPath value or null if the meeting wasn't found/authorized
 */
export async function attachAudio(
    meetingId: string, 
    userId: string,
    audioPath: string,
) {
    const meeting = await prisma.meeting.findFirst({
        where: {
            userId,
            id: meetingId,
        },
    });

    if (!meeting) {
        return null;
    }

    return prisma.meeting.update({
        where: {
            id: meetingId,
        },
        data: {
            audioPath,
        },
    });
}