import multer from "multer";
import { v4 as uuid } from "uuid";
import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxSize = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;

// Use memory storage to get buffer for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error(`Invalid file type: ${file.mimetype}`));
};

// Upload to Cloudinary from buffer
export const uploadToCloudinary = (buffer: Buffer, fileName: string): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vibeify",
        public_id: `${uuid()}_${fileName}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ secure_url: result?.secure_url || "", public_id: result?.public_id || "" });
      }
    );
    stream.end(buffer);
  });
};

export const uploadSingle = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single("image");
export const uploadMultiple = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).array("images", 20);
