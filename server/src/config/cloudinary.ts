import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";

console.log("Cloudinary config:");
console.log("Cloud name:", env.CLOUDINARY_CLOUD_NAME);
console.log(
    "API key:",
    env.CLOUDINARY_API_KEY ? "Present" : "Missing"
);
console.log(
    "API secret:",
    env.CLOUDINARY_API_SECRET ? "Present" : "Missing"
);

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary;