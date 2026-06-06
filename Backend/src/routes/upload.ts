import { Router, Response } from "express";
import { Upload } from "../models/Upload";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { uploadSingle, uploadMultiple, uploadToCloudinary } from "../middleware/upload";

const router = Router();

// POST /api/upload — admin, single
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: "No file. Send multipart/form-data with field 'image'" });
    
    try {
      const { secure_url: url, public_id } = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      await Upload.create({ 
        filename: public_id, 
        originalName: req.file.originalname, 
        mimeType: req.file.mimetype, 
        sizeBytes: req.file.size, 
        url, 
        uploadedBy: req.adminId 
      });
      return res.status(201).json({ success: true, data: { url, filename: public_id, originalName: req.file.originalname, mimeType: req.file.mimetype, sizeBytes: req.file.size } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Upload failed" });
    }
  });
});

// POST /api/upload/multiple — admin
router.post("/multiple", requireAdmin, (req: AuthRequest, res: Response) => {
  uploadMultiple(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ success: false, message: "No files provided" });
    
    try {
      const results = await Promise.all(files.map(async (file) => {
        const { secure_url: url, public_id } = await uploadToCloudinary(file.buffer, file.originalname);
        await Upload.create({ 
          filename: public_id, 
          originalName: file.originalname, 
          mimeType: file.mimetype, 
          sizeBytes: file.size, 
          url, 
          uploadedBy: req.adminId 
        });
        return { url, filename: public_id, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size };
      }));
      return res.status(201).json({ success: true, data: results });
    } catch (error) {
      return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Upload failed" });
    }
  });
});

// GET /api/upload — admin
router.get("/", requireAdmin, async (_req: AuthRequest, res: Response) => {
  const data = await Upload.find().sort({ createdAt: -1 }).limit(200);
  return res.json({ success: true, data });
});

export default router;
