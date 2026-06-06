import mongoose, { Document, Schema } from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  title: string;
  category: string;
  type: "image" | "video";
  eventId?: mongoose.Types.ObjectId;
  sortOrder: number;
  isActive: boolean;
}

const GallerySchema = new Schema<IGallery>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    category: { type: String, default: "All", enum: ["All","Wedding","Concert","Corporate","College Fest","Brand Launch"] },
    type: { type: String, enum: ["image", "video"], default: "image" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>("Gallery", GallerySchema);
