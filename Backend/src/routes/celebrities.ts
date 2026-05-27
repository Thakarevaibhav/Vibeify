import { Router, Request, Response } from "express";
import { z } from "zod";
import { Celebrity } from "../models/Celebrity";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { uploadSingle, fileUrl } from "../middleware/upload";

const router = Router();

// GET /api/celebrities — public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, sort, q, maxPrice, page = "1", limit = "50" } = req.query as Record<string, string>;
    const filter: Record<string, any> = { isActive: true };
    if (category && category !== "All") filter.category = category;
    if (maxPrice) filter.priceRange = { $lte: Number(maxPrice) };
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { tags: new RegExp(q, "i") }];

    const sortMap: Record<string, any> = {
      "popularity": { popularity: -1 },
      "price-low": { priceRange: 1 },
      "price-high": { priceRange: -1 },
      "name": { name: 1 },
    };
    const sortObj = sortMap[sort] || { popularity: -1 };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [data, total] = await Promise.all([
      Celebrity.find(filter).sort(sortObj).skip((pageNum - 1) * limitNum).limit(limitNum),
      Celebrity.countDocuments(filter),
    ]);
    return res.json({ success: true, data, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/celebrities/:slug — public
router.get("/:slug", async (req: Request, res: Response) => {
  const celeb = await Celebrity.findOne({ slug: req.params.slug, isActive: true });
  if (!celeb) return res.status(404).json({ success: false, message: "Celebrity not found" });
  return res.json({ success: true, data: celeb });
});

const celebSchema = z.object({
  slug: z.string().trim().min(2).max(100),
  name: z.string().trim().min(2).max(100),
  category: z.enum(["Actor", "Singer", "DJ", "Influencer", "Comedian", "Sports", "Dancer"]),
  bio: z.string().trim().max(1000).default(""),
  followers: z.string().trim().max(20).default("0"),
  popularity: z.coerce.number().int().min(0).max(100).default(50),
  priceRange: z.coerce.number().int().min(0).default(10),
  pastEvents: z.preprocess((v) => typeof v === "string" ? JSON.parse(v) : v, z.array(z.string())).default([]),
  tags: z.preprocess((v) => typeof v === "string" ? JSON.parse(v) : v, z.array(z.string())).default([]),
  isActive: z.coerce.boolean().default(true),
});

// POST /api/celebrities — admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const data = celebSchema.parse(req.body);
      const imageUrl = req.file ? fileUrl(req.file.filename) : req.body.imageUrl;
      if (!imageUrl) return res.status(400).json({ success: false, message: "image required" });
      const celeb = await Celebrity.create({ ...data, imageUrl });
      return res.status(201).json({ success: true, data: celeb });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
    }
  });
});

// PUT /api/celebrities/:id — admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const data = celebSchema.partial().parse(req.body);
      if (req.file) (data as any).imageUrl = fileUrl(req.file.filename);
      const celeb = await Celebrity.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!celeb) return res.status(404).json({ success: false, message: "Not found" });
      return res.json({ success: true, data: celeb });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
    }
  });
});

// DELETE /api/celebrities/:id — admin (soft)
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  await Celebrity.findByIdAndUpdate(req.params.id, { isActive: false });
  return res.json({ success: true, message: "Celebrity removed from public roster" });
});

// GET /api/celebrities/admin/all — admin
router.get("/admin/all", requireAdmin, async (_req: AuthRequest, res: Response) => {
  const data = await Celebrity.find().sort({ popularity: -1 });
  return res.json({ success: true, data });
});

export default router;
