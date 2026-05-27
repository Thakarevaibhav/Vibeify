import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db";

import adminRoutes from "./routes/admin";
import celebritiesRoutes from "./routes/celebrities";
import eventsRoutes from "./routes/events";
import galleryRoutes from "./routes/gallery";
import bookingsRoutes from "./routes/bookings";
import contactRoutes from "./routes/contact";
import uploadRoutes from "./routes/upload";

const app = express();
const PORT = Number(process.env.PORT || 4000);

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// console.log(process.env.FRONTEND_ORIGIN ? `CORS allowed origins: ${process.env.FRONTEND_ORIGIN}` : "CORS allowed origin: http://localhost:5173");
// CORS
const origins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
app.use(cors({ origin: origins, credentials: true, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));

// Body parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rate limiting
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use("/api/bookings", rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }));
app.use("/api/contact", rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/celebrities", celebritiesRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ success: true, message: "Vibeify API running", timestamp: new Date().toISOString() }));

// 404
app.use("/api/*", (_req, res) => res.status(404).json({ success: false, message: "Endpoint not found" }));

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Vibeify API → http://localhost:${PORT}`);
    console.log(`   POST /api/admin/login`);
    console.log(`   GET  /api/celebrities`);
    console.log(`   GET  /api/events`);
    console.log(`   GET  /api/gallery`);
    console.log(`   POST /api/bookings`);
    console.log(`   POST /api/contact`);
    console.log(`   POST /api/upload  [admin]`);
  });
}).catch((e) => { console.error("DB connection failed:", e); process.exit(1); });

export default app;
