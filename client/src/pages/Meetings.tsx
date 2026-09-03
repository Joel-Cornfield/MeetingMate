import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createMeeting, getMeetings, deleteMeeting, type Meeting } from "../services/meetingService";
import axios from "axios";
import { Link } from "react-router";

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
        <div>
            <header>
                <h1>MeetingMate</h1>

                <div>
                    <span>
                        {user?.email}
                    </span>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main>
                <h2>Your Meetings</h2>
                
                <form onSubmit={handleCreate}>
                    <input
                        type="text"
                        placeholder="Meeting title"
                        value={title}
                        onChange={(e) => 
                            setTitle(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create Meeting"
                        }
                    </button>
                </form>

                {error && (
                    <p>{error}</p>
                )}

                { loading ? (
                    <p>Loading meetings...</p>
                ) : meetings.length === 0 ? (
                    <p>
                        You don't have any meetings yet.
                    </p>
                ) : (
                    <div>
                        {meetings.map((meeting) => (
                            <article
                                key={meeting.id}
                            >
                                <h3>
                                    {meeting.title}
                                </h3>

                                <p>
                                    {new Date(
                                        meeting.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <Link
                                    to={`/meetings/${meeting.id}`}
                                >
                                    Open
                                </Link>

                                <button
                                    onClick={() => handleDelete(meeting.id)}
                                >
                                    Delete 
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}


