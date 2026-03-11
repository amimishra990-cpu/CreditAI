import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ai, MODEL } from "../gemini.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [".pdf", ".png", ".jpg", ".jpeg", ".xlsx", ".xls", ".csv", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error(`File type ${ext} not supported`));
    },
});

router.post("/upload", upload.array("files", 10), async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const workspaceId = req.body.workspaceId;

        if (!files || files.length === 0) {
            res.status(400).json({ error: "No files uploaded" });
            return;
        }

        const results = [];

        for (const file of files) {
            let extractedText = "";
            let classification = "Unknown";
            let confidence = 0;

            try {
                const fileBuffer = fs.readFileSync(file.path);
                const base64Data = fileBuffer.toString("base64");

                const response = await ai.models.generateContent({
                    model: MODEL,
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    inlineData: {
                                        mimeType: file.mimetype || "application/pdf",
                                        data: base64Data,
                                    },
                                },
                                {
                                    text: `You are a financial document analysis AI. Analyze this document and provide:
1. EXTRACTED_TEXT: Extract ALL text content from this document.
2. CLASSIFICATION: Classify this document:
   - "Annual Report", "ALM", "Shareholding Pattern", "Borrowing Profile",
   - "GST Returns", "Bank Statement", "Portfolio Performance",
   - "Legal Document", "Other Financial Document"
3. CONFIDENCE: Your confidence in the classification (0-100)

Respond ONLY in this JSON format:
{
  "extractedText": "...",
  "classification": "...",
  "confidence": 85
}`,
                                },
                            ],
                        },
                    ],
                });

                const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        extractedText = parsed.extractedText || "";
                        classification = parsed.classification || "Unknown";
                        confidence = parsed.confidence || 0;
                    } catch {
                        extractedText = text;
                    }
                } else {
                    extractedText = text;
                }
            } catch (err: any) {
                console.error("Gemini OCR error:", err.message);
                extractedText = `[OCR Error: ${err.message}]`;
            }

            const docResult = {
                id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                originalName: file.originalname,
                storedName: file.filename,
                size: file.size,
                mimeType: file.mimetype,
                path: file.path,
                extractedText,
                classification,
                confidence,
                uploadedAt: new Date().toISOString(),
            };

            results.push(docResult);

            // Persist documents to MongoDB
            if (workspaceId) {
                await Workspace.findOneAndUpdate(
                    { id: workspaceId },
                    { $push: { documents: docResult } }
                );
            }
        }

        res.json({ success: true, count: results.length, documents: results });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
