import { Router, Request, Response } from "express";
import { z } from "zod";
import { Contact } from "../models/Contact";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/contact — public
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(255),
      message: z.string().trim().min(10).max(1000),
    }).parse(req.body);
    const contact = await Contact.create(data);
    return res.status(201).json({ success: true, message: "Message received — we'll be in touch within 24 hours.", data: { id: contact._id } });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
  }
});

// GET /api/contact — admin
router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));
    const [data, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Contact.countDocuments(filter),
    ]);
    return res.json({ success: true, data, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/contact/:id — admin
router.get("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { $set: { status: "read" } }, { new: true });
  if (!contact) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: contact });
});

// PATCH /api/contact/:id/status — admin
router.patch("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = z.object({ status: z.enum(["unread","read","replied"]) }).parse(req.body);
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: contact });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// DELETE /api/contact/:id — admin
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  await Contact.findByIdAndDelete(req.params.id);
  return res.json({ success: true, message: "Deleted" });
});

export default router;
