import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createMeeting, getMeetings, deleteMeeting, type Meeting } from "../services/meetingService";
import axios from "axios";
import { Link } from "react-router";
import { DangerButton, PageShell, Panel, PrimaryButton, SecondaryButton, TextInput } from "../components/ui";

export default function Meetings() {
    const { user, logout } = useAuth();

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [title, setTitle] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMeetings() {
            try {
                const data = await getMeetings();
                setMeetings(data);
            } catch (error) {
                console.error(error)
                setError("Failed to load meetings");
            } finally {
                setLoading(false);
            }
        }

        loadMeetings();
    },[]);

    async function handleCreate(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        setError("");
        setCreating(true);

        try {
            const meeting = await createMeeting(title.trim());

            setMeetings((prev) => [meeting, ...prev]);

            setTitle("");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Failed to create meeting"
                );
            } else {
                setError("Failed to create meeting");
            }
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete (meetingId: string) {
        const confirmed = window.confirm("Are you sure you want to delete this meeting?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteMeeting(meetingId);

            setMeetings((prev) => 
                prev.filter(
                    (meeting) =>
                        meeting.id !== meetingId
                )
            );
        } catch (error) {
            console.error(error);
            setError("Failed to delete meeting");
        }

    }

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <PageShell>
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
                    <h1 className="text-2xl font-bold text-white">MeetingMate</h1>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-300">{user?.email}</span>
                        <SecondaryButton onClick={handleLogout} className="px-3 py-2 text-sm">
                            Logout
                        </SecondaryButton>
                    </div>
                </header>

                <main className="space-y-6">
                    <Panel>
                        <h2 className="mb-4 text-xl font-semibold text-white">Your Meetings</h2>

                        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
                            <TextInput
                                type="text"
                                placeholder="Meeting title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <PrimaryButton type="submit" disabled={creating} className="whitespace-nowrap">
                                {creating ? "Creating..." : "Create Meeting"}
                            </PrimaryButton>
                        </form>
                    </Panel>

                    {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <Panel>
                            <p className="text-slate-300">Loading meetings...</p>
                        </Panel>
                    ) : meetings.length === 0 ? (
                        <Panel>
                            <p className="text-slate-300">You don&apos;t have any meetings yet.</p>
                        </Panel>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {meetings.map((meeting) => (
                                <article
                                    key={meeting.id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20"
                                >
                                    <h3 className="mb-2 text-lg font-semibold text-white">
                                        {meeting.title}
                                    </h3>

                                    <p className="mb-4 text-sm text-slate-400">
                                        {new Date(meeting.createdAt).toLocaleDateString()}
                                    </p>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/meetings/${meeting.id}`}
                                            className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-violet-500"
                                        >
                                            Open
                                        </Link>

                                        <DangerButton onClick={() => handleDelete(meeting.id)} className="px-3 py-2 text-sm">
                                            Delete
                                        </DangerButton>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </PageShell>
    );
}


