import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connectDB } from "./db.js";

dotenv.config();

import onboardRouter from "./routes/onboard.js";
import uploadRouter from "./routes/upload.js";
import classifyRouter from "./routes/classify.js";
import analyzeRouter from "./routes/analyze.js";
import orchestrateRouter from "./routes/orchestrate.js";
import earlyWarningRouter from "./routes/early-warning.js";
import reportRouter from "./routes/report.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api", onboardRouter);
app.use("/api", uploadRouter);
app.use("/api", classifyRouter);
app.use("/api", analyzeRouter);
app.use("/api", orchestrateRouter);
app.use("/api", earlyWarningRouter);
app.use("/api", reportRouter);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 CreditAI Backend running on http://localhost:${PORT}`);
    });
});
