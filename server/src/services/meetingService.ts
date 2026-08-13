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

export async function deleteMeeting(
    meetingId: string,
    userId: string
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

    return prisma.meeting.delete({
        where: {
            id: meetingId,
        },
    });
}

