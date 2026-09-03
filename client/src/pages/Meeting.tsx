import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
    getMeeting,
    type Meeting as MeetingType,
} from "../services/meetingService";
import axios from "axios";

export default function Meeting() {
    const { id } = useParams();

    const [meeting, setMeeting] = useState<MeetingType | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setError("Meeting ID is missing");
            setLoading(false);
            return;
        }

        async function loadMeeting() {
            try {
                const data = await getMeeting(id!);

                setMeeting(data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load meeting"
                    )
                } else {
                    setError("Failed to load meeting");
                }
            } finally { 
                setLoading(false);
            }
        }

        loadMeeting();
    },[id]);

    if (loading) {
        return <p>Loading meeting...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!meeting) {
        return <p>Meeting not found.</p>;
    }

    return (
        <div>
            <Link
                to="/meetings"
            >
               ← Back to meetings
            </Link>

            <h1>{meeting.title}</h1>

            <p>
                Created{" "}
                {new Date(
                    meeting.createdAt
                ).toLocaleDateString()}
            </p>

            <section>
                <h2>Audio</h2>

                {meeting.audioPath ? (
                    <p>
                        Audio Uploaded ✓
                    </p>
                ) : (
                    <p>
                        No audio uploaded yet.
                    </p>
                )}
            </section>

            <section>
                <h2>Transcript</h2>

                {meeting.transcript ? (
                    <p>
                        {meeting.transcript}
                    </p>
                ) : (
                    <p>
                        No transcript yet.
                    </p>
                )} 
            </section>

            <section>
                <h2>Summary</h2>

                {meeting.summary ? (
                    <p>
                        {meeting.transcript}
                    </p>
                ) : (
                    <p>
                        No summary yet.
                    </p>
                )} 
            </section>

            <section>
                <h2>Action Items</h2>

                {meeting.actionItems?.length ? (
                    <ul>
                        {meeting.actionItems.map((action) => (
                            <li key={action.id}>
                                {action.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        No action items yet.
                    </p>
                )}
            </section>
        </div>
    )
}