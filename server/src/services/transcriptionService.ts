import path from "path";
import os from "os";
import fs from "fs/promises";
import { spawn } from "child_process";

/**
 * Downloads an audio file from a given URL, saves it to a temporary directory,
 * and uses an external Python script to transcribe the audio using Whisper.
 * It ensures the temporary file is deleted after the transcription completes or fails.
 * 
 * @param audioUrl - The direct URL of the audio file to transcribe .
 * @returns A promise that resolves to the transcribed text.
 * @throws {Error} If the audio download fails or the transcription script encounters an error.
 */
export async function transcribeAudio(
    audioUrl: string
): Promise<string> {
    const serverRoot = process.cwd();
    const projectRoot = path.resolve(serverRoot, "..");

    const scriptPath = path.join(
        projectRoot,
        "transcription/transcribe.py"
    );

    const pythonPath =
        process.env.PYTHON_PATH || "python3";

    const fileExtension = getAudioExtension(audioUrl);

    const temporaryAudioPath = path.join(
        os.tmpdir(),
        `meetingmate-${Date.now()}${fileExtension}`
    );

    try {
        console.log("Starting transcription...");
        console.log("Audio URL:", audioUrl);
        console.log("Downloading audio to:", temporaryAudioPath);

        // Download the audio file from Cloudinary
        const response = await fetch(audioUrl);

        if (!response.ok) {
            throw new Error(
                `Failed to download audio from Cloudinary: ${response.status} ${response.statusText}`
            );
        }

        const audioBuffer = Buffer.from(
            await response.arrayBuffer()
        );

        await fs.writeFile(
            temporaryAudioPath,
            audioBuffer
        );

        console.log(
            `Downloaded ${audioBuffer.length} bytes`
        );

        console.log("Python:", pythonPath);
        console.log("Script:", scriptPath);
        console.log("Temporary audio:", temporaryAudioPath);

        const transcript = await runWhisper(
            pythonPath,
            scriptPath,
            temporaryAudioPath
        );

        return transcript;
    } finally {
        // Remove the temporary audio file
        try {
            await fs.unlink(temporaryAudioPath);

            console.log(
                "Deleted temporary audio:",
                temporaryAudioPath
            );
        } catch {
            // File may not exist if the download failed
        }
    }
}

/**
 * Runs the Python Whisper transcription script.
 */
function runWhisper(
    pythonPath: string,
    scriptPath: string,
    audioPath: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(
            pythonPath,
            [scriptPath, audioPath]
        );

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
            const text = data.toString();

            output += text;

            console.log(
                "Python stdout:",
                text
            );
        });

        pythonProcess.stderr.on("data", (data) => {
            const text = data.toString();

            errorOutput += text;

            console.log(
                "Python stderr:",
                text
            );
        });

        pythonProcess.on("close", (code) => {
            console.log(
                "Python process exited with code:",
                code
            );

            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(
                    new Error(
                        errorOutput ||
                        `Transcription failed with code ${code}`
                    )
                );
            }
        });

        pythonProcess.on("error", (error) => {
            console.error(
                "Failed to start Python:",
                error
            );

            reject(error);
        });
    });
}

/**
 * Gets the audio file extension from a Cloudinary URL.
 *
 * Falls back to .mp3 if no extension can be determined.
 */
function getAudioExtension(
    audioUrl: string
): string {
    try {
        const url = new URL(audioUrl);

        const pathname = url.pathname;

        const extension = path.extname(pathname);

        if (extension) {
            return extension;
        }
    } catch {
        // Fall through to default extension.
    }

    return ".mp3";
}