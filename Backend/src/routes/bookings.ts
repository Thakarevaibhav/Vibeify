import { Router, Request, Response } from "express";
import { z } from "zod";
import { Booking } from "../models/Booking";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

const bookingSchema = z.object({
  eventType: z.string().trim().min(1).max(80),
  celebId: z.string().trim().optional(),
  budget: z.string().trim().min(1).max(50),
  date: z.string().trim().min(1),
  location: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  notes: z.string().trim().max(1000).optional(),
});

// POST /api/bookings — public
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = bookingSchema.parse(req.body);
    const booking = await Booking.create(data);
    return res.status(201).json({ success: true, message: "Booking inquiry submitted! Our team will reach out within 24 hours.", data: booking });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
  }
});

// GET /api/bookings — admin
router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [data, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Booking.countDocuments(filter),
    ]);
    return res.json({ success: true, data, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/bookings/:id — admin
router.get("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: booking });
});

// PATCH /api/bookings/:id/status — admin
router.patch("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = z.object({ status: z.enum(["new","contacted","quoted","booked","cancelled"]) }).parse(req.body);
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: booking });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// DELETE /api/bookings/:id — admin
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  await Booking.findByIdAndDelete(req.params.id);
  return res.json({ success: true, message: "Deleted" });
});

export default router;
