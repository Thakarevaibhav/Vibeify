import { Router, Request, Response } from "express";
import { z } from "zod";
import { Event } from "../models/Event";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { uploadSingle, fileUrl } from "../middleware/upload";

const router = Router();

// GET /api/events — public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, category, page = "1", limit = "50" } = req.query as Record<string, string>;
    const filter: Record<string, any> = { isActive: true };
    if (status && ["upcoming","past"].includes(status)) filter.status = status;
    if (category && category !== "All") filter.category = category;

    const sortOrder = status === "past" ? -1 : 1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [data, total] = await Promise.all([
      Event.find(filter).sort({ date: sortOrder }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Event.countDocuments(filter),
    ]);
    return res.json({ success: true, data, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/events/:slug — public
router.get("/:slug", async (req: Request, res: Response) => {
  const event = await Event.findOne({ slug: req.params.slug, isActive: true });
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  return res.json({ success: true, data: event });
});

const eventSchema = z.object({
  slug: z.string().trim().min(2).max(100),
  title: z.string().trim().min(2).max(200),
  category: z.enum(["Wedding","Concert","Corporate","College Fest","Brand Launch","Private"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).default(""),
  headliners: z.preprocess((v) => typeof v === "string" ? JSON.parse(v) : v, z.array(z.string())).default([]),
  status: z.enum(["upcoming","past"]).default("upcoming"),
  attendance: z.string().trim().max(50).optional(),
  isActive: z.coerce.boolean().default(true),
});

// POST /api/events — admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const data = eventSchema.parse(req.body);
      const imageUrl = req.file ? fileUrl(req.file.filename) : req.body.imageUrl;
      if (!imageUrl) return res.status(400).json({ success: false, message: "image required" });
      const event = await Event.create({ ...data, imageUrl });
      return res.status(201).json({ success: true, data: event });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
    }
  });
});

// PUT /api/events/:id — admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const data = eventSchema.partial().parse(req.body);
      if (req.file) (data as any).imageUrl = fileUrl(req.file.filename);
      const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!event) return res.status(404).json({ success: false, message: "Not found" });
      return res.json({ success: true, data: event });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
    }
  });
});

// DELETE /api/events/:id — admin (soft)
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  await Event.findByIdAndUpdate(req.params.id, { isActive: false });
  return res.json({ success: true, message: "Event removed" });
});

// GET /api/events/admin/all — admin
router.get("/admin/all", requireAdmin, async (_req: AuthRequest, res: Response) => {
  const data = await Event.find().sort({ date: -1 });
  return res.json({ success: true, data });
});

export default router;
