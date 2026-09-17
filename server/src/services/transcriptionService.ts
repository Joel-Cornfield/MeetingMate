import path from "path";
import { spawn } from "child_process";

export function transcribeAudio(audioPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const serverRoot = process.cwd();
        const projectRoot = path.resolve(serverRoot, "..");

        const scriptPath = path.join(
            projectRoot,
            "transcription/transcribe.py"
        );

        const absoluteAudioPath = path.resolve(
            serverRoot,
            audioPath
        );

        const pythonPath =
            process.env.PYTHON_PATH || "python3";

        console.log("Starting transcription...");
        console.log("Python:", pythonPath);
        console.log("Script:", scriptPath);
        console.log("Audio:", absoluteAudioPath);

        const pythonProcess = spawn(
            pythonPath,
            [scriptPath, absoluteAudioPath]
        );

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
            const text = data.toString();

            output += text;

            console.log("Python stdout:", text);
        });

        pythonProcess.stderr.on("data", (data) => {
            const text = data.toString();

            errorOutput += text;

            console.log("Python stderr:", text);
        });

        pythonProcess.on("close", (code) => {
            console.log("Python process exited with code:", code);

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
            console.error("Failed to start Python:", error);
            reject(error);
        });
    });
}