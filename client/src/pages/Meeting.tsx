import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router";

import {
    getMeeting,
    summariseMeeting,
    transcribeMeeting,
    uploadAudio,
    type Meeting as MeetingType,
} from "../services/meetingService";
import axios from "axios";
import { PageShell, Panel, PrimaryButton } from "../components/ui";

export default function Meeting() {
    const { id } = useParams();

    const [meeting, setMeeting] = useState<MeetingType | null>(null);

    const [uploading, setUploading] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [summarising, setSummarising] = useState(false);
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

    async function handleSummarise() {
        if (!id || !meeting?.transcript) {
            return;
        }

        try {
            setSummarising(true);
            setActionError("");

            const updatedMeeting = await summariseMeeting(id);

            setMeeting(updatedMeeting);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setActionError(
                    error.response?.data?.message || "Failed to generate meeting notes"
                );
            } else {
                setActionError("Failed to generate meeting notes");
            }
        } finally {
            setSummarising(false);
        }
    }

    if (loading) {
        return (
            <PageShell>
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
                    Loading meeting...
                </div>
            </PageShell>
        );
    }

    if (error) {
        return (
            <PageShell>
                <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                    {error}
                </div>
            </PageShell>
        );
    }

    if (!meeting) {
        return (
            <PageShell>
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
                    Meeting not found.
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    to="/meetings"
                    className="inline-flex items-center text-sm text-violet-300 transition hover:text-violet-200"
                >
                    ← Back to meetings
                </Link>

                <header className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
                    <h1 className="text-3xl font-bold text-white">{meeting.title}</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Created {new Date(meeting.createdAt).toLocaleDateString()}
                    </p>
                </header>

                {actionError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {actionError}
                    </div>
                )}

                <Panel className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Audio</h2>

                    {meeting.audioPath ? (
                        <>
                            <p className="text-sm text-emerald-300">Audio uploaded ✓</p>
                            <PrimaryButton onClick={handleTranscribe} disabled={transcribing}>
                                {transcribing ? "Transcribing..." : "Transcribe"}
                            </PrimaryButton>
                        </>
                    ) : (
                        <>
                            <p className="text-slate-300">No audio uploaded yet.</p>
                            <label htmlFor="audio" className="inline-block cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-violet-500">
                                Upload Audio
                            </label>
                            <input
                                id="audio"
                                type="file"
                                accept="audio/*.mp3,.wav,.m4a"
                                onChange={handleAudioUpload}
                                disabled={uploading}
                                className="hidden"
                            />

                            {uploading && (
                                <p className="text-sm text-slate-300">Uploading...</p>
                            )}
                        </>
                    )}
                </Panel>

                <Panel className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Transcript</h2>

                    {meeting.transcript ? (
                        <>
                            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-200 whitespace-pre-wrap">
                                {meeting.transcript}
                            </div>

                            <PrimaryButton onClick={handleSummarise} disabled={summarising}>
                                {summarising ? "Generating Notes..." : "Generate Meeting Notes"}
                            </PrimaryButton>
                        </>
                    ) : (
                        <p className="text-slate-300">No transcript yet.</p>
                    )}
                </Panel>

                <Panel className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Summary</h2>

                    {meeting.summary ? (
                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-200 whitespace-pre-wrap">
                            {meeting.summary}
                        </div>
                    ) : (
                        <p className="text-slate-300">No summary yet.</p>
                    )}
                </Panel>

                <Panel className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Action Items</h2>

                    {meeting.actionItems?.length ? (
                        <ul className="space-y-3">
                            {meeting.actionItems.map((action) => (
                                <li key={action.id} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
                                    {action.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-300">No action items yet.</p>
                    )}
                </Panel>
            </div>
        </PageShell>
    )
}