import mongoose, { Document, Schema } from "mongoose";

export type EventCategory = "Wedding" | "Concert" | "Corporate" | "College Fest" | "Brand Launch" | "Private";

export interface IEvent extends Document {
  slug: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
  headliners: string[];
  status: "upcoming" | "past";
  attendance?: string;
  isActive: boolean;
}

const EventSchema = new Schema<IEvent>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ["Wedding","Concert","Corporate","College Fest","Brand Launch","Private"] },
    date: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, default: "" },
    headliners: [{ type: String }],
    status: { type: String, enum: ["upcoming","past"], default: "upcoming" },
    attendance: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EventSchema.index({ status: 1, isActive: 1, date: 1 });

export const Event = mongoose.model<IEvent>("Event", EventSchema);
