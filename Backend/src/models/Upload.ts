import mongoose, { Document, Schema } from "mongoose";

export interface IUpload extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedBy?: string;
}

const UploadSchema = new Schema<IUpload>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: String },
  },
  { timestamps: true }
);

export const Upload = mongoose.model<IUpload>("Upload", UploadSchema);
