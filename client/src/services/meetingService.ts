import api from "./api";

export interface Meeting {
    id: string;
    title: string;
    audioPath: string | null;
    transcript: string | null;
    summary: string | null;
    userId: string;
    createdAt: string;
    actionItems?: ActionItem[];
}

export interface ActionItem {
    id: string;
    content: string;
    completed: boolean;
    meetingId: string;
}

export async function getMeetings() {
     const response = await api.get<Meeting[]>("/meetings");

     return response.data;
}

export async function createMeeting(title: string) {
    const response = await api.post<Meeting>("/meetings", {
        title,
    });

    return response.data;
}

export async function deleteMeeting(id: string) {
    await api.delete(`/meetings/${id}`);
}

export async function getMeeting(id: string) {
    const response = await api.get<Meeting>(`/meetings/${id}`);

    return response.data;
}

