import {
  v2 as cloudinary,
  type UploadApiResponse,
  type UploadApiErrorResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary (folder "productos") and returns the
 * secure_url. Uses upload_stream so we can push the in-memory buffer directly.
 */
export function uploadToCloudinary(buffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "productos",
        resource_type: "image",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error("Cloudinary returned no result"));
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}
