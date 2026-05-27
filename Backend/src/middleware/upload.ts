import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { Request } from "express";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => cb(null, `${uuid()}${path.extname(file.originalname).toLowerCase()}`),
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxSize = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error(`Invalid file type: ${file.mimetype}`));
};

export const uploadSingle = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single("image");
export const uploadMultiple = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).array("images", 20);
export const fileUrl = (filename: string) => `/uploads/${filename}`;
