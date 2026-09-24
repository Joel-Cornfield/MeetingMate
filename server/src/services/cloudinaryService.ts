import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a raw audio file buffer to Cloudinary using a writable stream.
 * Generates a unique, URL-safe public ID using the original file name and a timestamp.
 * 
 * @param buffer - The raw binary data of the audio file in memory.
 * @param originalName - The original filename used to construct the asset's public ID.
 * @returns A promise that resolves to the secure HTTPS URL of the uploaded audio asset.
 */
export function uploadAudioToCloudinary(
    buffer: Buffer,
    originalName: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "video",
                folder: "meetingmate/audio",
                public_id: `${Date.now()}-${originalName
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[^a-zA-Z0-9-_]/g, "-")}`,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed");
                    console.error("Error:", error);
                    console.error("Error message:", error.message);
                    console.error("HTTP code:", error.http_code);
                    console.error("Error name:", error.name);

                    if (error.http_code === 403) {
                        reject(
                            new Error(
                                "Cloudinary rejected the upload. Check your Cloudinary credentials in Render and verify the account is active and allows uploads."
                            )
                        );
                        return;
                    }

                    reject(error);
                    return;
                }

                if (!result?.secure_url) {
                    reject(
                        new Error("Cloudinary upload did not return a URL")
                    );
                    return;
                }

                console.log(
                    "Cloudinary upload successful:",
                    result.secure_url
                );

                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
}