import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router";

import {
    getMeeting,
    transcribeMeeting,
    uploadAudio,
    type Meeting as MeetingType,
} from "../services/meetingService";
import axios from "axios";

export default function Meeting() {
    const { id } = useParams();

    const [meeting, setMeeting] = useState<MeetingType | null>(null);

    const [uploading, setUploading] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [actionError, setActionError] = useState("");

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

    async function handleAudioUpload(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file || !id) {
            return;
        }

        setActionError("");
        setUploading(true);

        try {
            await uploadAudio(id, file);

            const updatedMeeting = await getMeeting(id);

            setMeeting(updatedMeeting);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setActionError(error.response?.data?.message || "Failed to upload audio");
            } else {
                setActionError("Failed to upload audio");
            }
        } finally {
            setUploading(false);

            // Allow user to select same file again
            event.target.value = "";
        }
    }

    async function handleTranscribe() {
        if (!id) {
            return;
        }

        setActionError("");
        setTranscribing(true);

        try {
            await transcribeMeeting(id);

            const updatedMeeting = await getMeeting(id);

            setMeeting(updatedMeeting);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setActionError(error.response?.data?.message || "Failed to transcribe meeting");
            } else {
                setActionError("Failed to transcribe meeting");
            }
        } finally {
            setTranscribing(false);
        }
    }

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
                    <>
                        <p>
                            Audio Uploaded ✓
                        </p>
                        <button
                            onClick={handleTranscribe}
                            disabled={transcribing}
                        >
                            {transcribing 
                                ? "Transcribing..." 
                                : "Transcribe"}
                        </button>
                    </>
                ) : (
                    <>
                        <p>
                            No audio uploaded yet.
                        </p>
                        <label htmlFor="audio">
                            Upload Audio
                        </label>
                        <input
                            id="audio"
                            type="file"
                            accept="audio/*.mp3,.wav,.m4a"
                            onChange={handleAudioUpload}
                            disabled={uploading}
                        />

                        {uploading && (
                            <p>
                                Uploading...
                            </p>
                        )}
                    </>
                )}
            </section>

            <section>
                <h2>Transcript</h2>

                {meeting.transcript ? (
                    <p>
                        {meeting.transcript}
                    </p>
                ) : meeting.audioPath ? (
                    <p>
                        Audio is ready to transcribe.
                    </p>
                ) : (
                    <p>
                        Upload an audio file to transcribe it.
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