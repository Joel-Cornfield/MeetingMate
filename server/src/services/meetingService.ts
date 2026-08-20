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

/**
 * Safely fetches the audio asset metadata for a meeting, ensuring resource ownership.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @returns An object containing the meeting ID and audio file path if found, or null if unauthorized/not found
 */
export async function getAudio(
    meetingId: string,
    userId: string,
) {
    return prisma.meeting.findFirst({
        where: {
            userId,
            id: meetingId,
        },
        select: {
            id: true,
            audioPath: true,
        }
    });
}

/**
 * Updates a meeting's trancript string after validating resource ownership.
 * Uses a scoped update constraint to prevent unauthorized modifications.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @param transcript - The processed text content to be saved 
 * @returns A prisma batch object containing the count of affected rows (0 or 1) 
 */
export async function saveTranscript(
    meetingId: string,
    userId: string,
    transcript: string,
) {
    return prisma.meeting.updateMany({
        where: {
            id: meetingId,
            userId,
        },
        data: {
            transcript,
        }
    });
}

/**
 * Retrieves a meeting's transcript after verifying ownership.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @returns An object containing the transcript if found, or null if unauthorized/not found 
 */
export async function getTranscript(
    meetingId: string,
    userId: string,
) {
    return prisma.meeting.findFirst({
        where: {
            id: meetingId,
            userId,
        },
        select: {
            transcript: true,
        }
    });
}

/**
 * Saves a meeting summary and overrides any pre-existing action items within a database transaction.
 * Verifies meeting ownership before proceeding.
 * @param meetingId - The ID of the target meeting
 * @param userId - The ID of the requesting user
 * @param summary - The meeting text summary to save
 * @param actionItems - An array of new action item strings to save 
 * @returns The updated meeting object with its action items, or null if meeting not found
 */
export async function saveSummary(
    meetingId: string,
    userId: string,
    summary: string,
    actionItems: string[]
) {
    const meeting = await prisma.meeting.findFirst({
        where: {
            id: meetingId,
            userId,
        },
    });

    if (!meeting) {
        return null;
    }

    await prisma.$transaction(async (tx) => {
        await tx.meeting.update({
            where: {
                id: meetingId,
            },
            data: {
                summary
            }
        });

        // Delete previous action items
        await tx.actionItem.deleteMany({
            where: {
                meetingId,
            },
        });

        if (actionItems.length > 0) {
            await tx.actionItem.createMany({
                data: actionItems.map((content) => ({
                    content,
                    meetingId,
                })),
            });
        }
    });

    return prisma.meeting.findUnique({
        where: {
            id: meetingId
        },
        include: {
            actionItems: true,
        },
    });
}