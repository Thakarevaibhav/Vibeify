import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/vibeify";
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected:", uri);
}
