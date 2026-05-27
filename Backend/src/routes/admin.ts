import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Admin } from "../models/Admin";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  console.log("Admin login attempt:", req.body);
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }).parse(req.body);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,
    });

    return res.json({ success: true, data: { token, admin: { id: admin._id, email: admin.email, name: admin.name } } });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
  }
});

// GET /api/admin/me
router.get("/me", requireAdmin, async (req: AuthRequest, res: Response) => {
  const admin = await Admin.findById(req.adminId).select("-password");
  if (!admin) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: admin });
});

// POST /api/admin/change-password
router.post("/change-password", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }).parse(req.body);

    const admin = await Admin.findById(req.adminId);
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ success: false, message: "Current password incorrect" });
    }
    admin.password = bcrypt.hashSync(newPassword, 12);
    await admin.save();
    return res.json({ success: true, message: "Password updated" });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.errors?.[0]?.message || e.message });
  }
});

export default router;
