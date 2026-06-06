import mongoose, { Document, Schema } from "mongoose";

export type Category = "Actor" | "Actress" | "Singer" | "DJ" | "Influencer" | "Comedian" | "Sports" | "Dancer";

export interface ICelebrity extends Document {
  slug: string;
  name: string;
  category: Category;
  imageUrl: string;
  bio: string;
  followers: string;
  popularity: number;
  priceRange: number;
  pastEvents: string[];
  tags: string[];
  isActive: boolean;
}

const CelebritySchema = new Schema<ICelebrity>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Actor","Actress","Singer","DJ","Influencer","Comedian","Sports","Dancer"] },
    imageUrl: { type: String, required: true },
    bio: { type: String, default: "" },
    followers: { type: String, default: "0" },
    popularity: { type: Number, default: 50, min: 0, max: 100 },
    priceRange: { type: Number, default: 10, min: 0 },
    pastEvents: [{ type: String }],
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CelebritySchema.index({ category: 1, isActive: 1, popularity: -1 });

export const Celebrity = mongoose.model<ICelebrity>("Celebrity", CelebritySchema);
