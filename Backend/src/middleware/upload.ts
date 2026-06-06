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

// File type configurations
const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
const allowedTypes = [...imageTypes, ...videoTypes];

const maxSize = Number(process.env.MAX_FILE_SIZE_MB || 100) * 1024 * 1024;

// Use memory storage to get buffer for Cloudinary upload
const storage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  imageTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error(`Invalid image type: ${file.mimetype}`));
};

// File filter for videos only
const videoFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  videoTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error(`Invalid video type: ${file.mimetype}`));
};

// File filter for both images and videos
const generalFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

// Image uploads (for celebrities and events)
export const uploadSingle = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: maxSize } }).single("image");

// Gallery uploads (images and videos)
export const uploadGallerySingle = multer({ storage, fileFilter: generalFileFilter, limits: { fileSize: maxSize } }).single("file");
export const uploadGalleryMultiple = multer({ storage, fileFilter: generalFileFilter, limits: { fileSize: maxSize } }).array("files", 20);
