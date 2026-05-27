import { Router, Request, Response } from "express";
import { z } from "zod";
import { Gallery } from "../models/Gallery";
import { Upload } from "../models/Upload";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { uploadSingle, uploadMultiple, fileUrl } from "../middleware/upload";

const router = Router();

// GET /api/gallery — public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "24" } = req.query as Record<string, string>;
    const filter: Record<string, any> = { isActive: true };
    if (category && category !== "All") filter.category = category;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [data, total] = await Promise.all([
      Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Gallery.countDocuments(filter),
    ]);
    return res.json({ success: true, data, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/gallery/:id — public
router.get("/:id", async (req: Request, res: Response) => {
  const item = await Gallery.findOne({ _id: req.params.id, isActive: true });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: item });
});

// POST /api/gallery — admin, single upload
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    try {
      const imageUrl = fileUrl(req.file.filename);
      await Upload.create({ filename: req.file.filename, originalName: req.file.originalname, mimeType: req.file.mimetype, sizeBytes: req.file.size, url: imageUrl, uploadedBy: req.adminId });
      const item = await Gallery.create({
        imageUrl,
        title: req.body.title || "",
        category: req.body.category || "All",
        eventId: req.body.eventId || undefined,
        sortOrder: Number(req.body.sortOrder) || 0,
      });
      return res.status(201).json({ success: true, data: item });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  });
});

// POST /api/gallery/bulk — admin, multiple upload
router.post("/bulk", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadMultiple(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ success: false, message: "No files provided" });
    try {
      const items = await Promise.all(files.map(async (file) => {
        const imageUrl = fileUrl(file.filename);
        await Upload.create({ filename: file.filename, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size, url: imageUrl, uploadedBy: req.adminId });
        return Gallery.create({ imageUrl, title: file.originalname.replace(/\.[^.]+$/, ""), category: req.body.category || "All", eventId: req.body.eventId || undefined, sortOrder: 0 });
      }));
      return res.status(201).json({ success: true, data: items, message: `${items.length} image(s) uploaded` });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  });
});

// PUT /api/gallery/:id — admin, update metadata
router.put("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      title: z.string().max(200).optional(),
      category: z.enum(["All","Wedding","Concert","Corporate","College Fest","Brand Launch"]).optional(),
      eventId: z.string().optional(),
      sortOrder: z.coerce.number().optional(),
      isActive: z.coerce.boolean().optional(),
    });
    const data = schema.parse(req.body);
    const item = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: item });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// PATCH /api/gallery/reorder — admin
router.patch("/reorder", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = z.object({ items: z.array(z.object({ id: z.string(), sortOrder: z.number() })) }).parse(req.body);
    await Promise.all(items.map(({ id, sortOrder }) => Gallery.findByIdAndUpdate(id, { sortOrder })));
    return res.json({ success: true, message: "Reordered" });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

// DELETE /api/gallery/:id — admin soft delete
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  await Gallery.findByIdAndUpdate(req.params.id, { isActive: false });
  return res.json({ success: true, message: "Removed" });
});

// GET /api/gallery/admin/all — admin
router.get("/admin/all", requireAdmin, async (_req: AuthRequest, res: Response) => {
  const data = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
  return res.json({ success: true, data });
});

export default router;
