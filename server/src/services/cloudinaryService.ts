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
                resource_type: "auto",
                folder: "meetingmate/audio",
                public_id: `${Date.now()}-${originalName
                    .replace(/\.[^/.]+$/, "") // strip file extension (cloudinary auto appends it)
                    .replace(/[^a-zA-Z0-9-_]/g, "-")}`, // replace any illegal characters or spaces
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                } 

                if (!result?.secure_url) {
                    reject(
                        new Error("Cloudinary upload did not return a URL")
                    );
                    return;
                }

                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    })
}