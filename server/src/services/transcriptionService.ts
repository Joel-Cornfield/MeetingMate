import path from "path";
import { spawn } from "child_process";

/**
 * Spawns an isolated Python subprocess to handle resource-heavy audio transcription.
 * Offloads execution to a Python virtual environment script to capture stdout transcription text.
 * 
 * @param audioPath - Absolute or relative path to the source audio file
 * @returns A promise that resolves with the full trimmed transcript string
 * @throws {Error} If the Python runtime fails, exits with a non-zero code, or encounters an internal crash
 */
export function transcribeAudio(audioPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const serverRoot = process.cwd();

        const projectRoot = path.resolve(serverRoot, "..");

        const scriptPath = path.join(
            projectRoot,
            "transcription/transcribe.py"
        );

        const pythonPath = path.join(
            projectRoot,
            "transcription/.venv/bin/python"
        );

        const absoluteAudioPath = path.resolve(
            serverRoot, audioPath
        );

        const python_process = spawn(
            pythonPath,
            [scriptPath, absoluteAudioPath]
        );

        let output = "";
        let errorOutput = "";

        // Stream chunks of text whenever the Python script prints to the console (sys.stdout)
        python_process.stdout.on("data", (data) => {
            output += data.toString();
        });

        // Stream chunks of text if the Python script throws an unhandled exception or logs errors (sys.stderr)
        python_process.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        python_process.on("close", (code) => {
            if (code === 0) {
                // return the captured console text back to the main application loop
                resolve(output.trim());
            } else {
                reject(
                    new Error(
                        errorOutput || `Transcription failed with code ${code}`
                    )
                );
            }
        });

        // Triggered if the operating system cannot find or run the Python executable file itself
        python_process.on("error", (error) => {
            reject(error);
        });
    });
}