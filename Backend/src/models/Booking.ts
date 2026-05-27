import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  eventType: string;
  celebId?: string;
  budget: string;
  date: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: "new" | "contacted" | "quoted" | "booked" | "cancelled";
}

const BookingSchema = new Schema<IBooking>(
  {
    eventType: { type: String, required: true },
    celebId: { type: String },
    budget: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ["new","contacted","quoted","booked","cancelled"], default: "new" },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
