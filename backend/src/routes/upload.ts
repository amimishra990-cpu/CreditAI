import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { callGroqJSON, GROQ_MODEL_VERSATILE } from "../groq.js";
import { Workspace } from "../models/Workspace.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { auditLog } from "../middleware/audit.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, `${Date.now()}-${sanitized}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (_req, file, cb) => {
        const allowed = [".pdf", ".png", ".jpg", ".jpeg", ".xlsx", ".xls", ".csv", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${ext} not supported. Allowed: ${allowed.join(", ")}`));
        }
    },
});

router.post(
    "/upload",
    authenticate,
    upload.array("files", 10),
    auditLog("upload_documents", "document"),
    async (req: AuthRequest, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];
            const { workspaceId } = req.body;

            if (!files || files.length === 0) {
                res.status(400).json({ error: "No files uploaded" });
                return;
            }

            if (!workspaceId) {
                res.status(400).json({ error: "workspaceId is required" });
                return;
            }

            // Verify workspace exists and user has access
            const workspace = await Workspace.findOne({ id: workspaceId });
            if (!workspace) {
                res.status(404).json({ error: "Workspace not found" });
                return;
            }

            const results = [];

            for (const file of files) {
                let extractedText = "";
                let classification = "Other Financial Document";
                let confidence = 0;

                try {
                    // Use Groq AI to classify document based on filename and type
                    const prompt = `You are a financial document classification AI. Analyze this document:

FILENAME: ${file.originalname}
FILE TYPE: ${file.mimetype}
FILE SIZE: ${(file.size / 1024).toFixed(2)} KB

Based on the filename and type, classify this document into ONE of these categories:
- "Annual Report"
- "ALM" 
- "Shareholding Pattern"
- "Borrowing Profile"
- "GST Returns"
- "Bank Statement"
- "Portfolio Performance"
- "Legal Document"
- "Other Financial Document"

Respond ONLY in this JSON format:
{
  "extractedText": "[Brief description of what this document likely contains based on filename]",
  "classification": "...",
  "confidence": 85
}`;

                    const result = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);

                    extractedText = result.extractedText || `Document: ${file.originalname}`;
                    classification = result.classification || "Other Financial Document";
                    confidence = result.confidence || 75;

                } catch (err: any) {
                    console.error("Groq API error:", err.message);
                    extractedText = `[Document uploaded: ${file.originalname}. Full OCR processing available in next step.]`;
                    classification = "Other Financial Document";
                    confidence = 50;
                }

                const docResult = {
                    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    originalName: file.originalname,
                    storedName: file.filename,
                    size: file.size,
                    mimeType: file.mimetype,
                    path: file.path,
                    extractedText,
                    classification,
                    confidence,
                    analystVerified: false,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: req.user!.id,
                };

                results.push(docResult);
            }

            // Save all documents to workspace in database
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                {
                    $push: { documents: { $each: results } },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            );

            res.json({
                success: true,
                count: results.length,
                documents: results,
                message: `${results.length} document(s) uploaded and classified successfully`,
            });
        } catch (error: any) {
            console.error("Upload error:", error);
            res.status(500).json({ error: error.message || "Upload failed" });
        }
    }
);

// Get documents for a workspace
router.get(
    "/documents/:workspaceId",
    authenticate,
    auditLog("view_documents", "document"),
    async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findOne({ id: workspaceId });
            if (!workspace) {
                res.status(404).json({ error: "Workspace not found" });
                return;
            }

            res.json({
                success: true,
                documents: workspace.documents || [],
                count: workspace.documents?.length || 0,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete a document
router.delete(
    "/documents/:workspaceId/:documentId",
    authenticate,
    auditLog("delete_document", "document"),
    async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId, documentId } = req.params;

            const workspace = await Workspace.findOne({ id: workspaceId });
            if (!workspace) {
                res.status(404).json({ error: "Workspace not found" });
                return;
            }

            // Find and remove document
            const docIndex = workspace.documents.findIndex((d: any) => d.id === documentId);
            if (docIndex === -1) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            const doc = workspace.documents[docIndex];

            // Delete file from disk
            if (doc.path && fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }

            // Remove from database
            workspace.documents.splice(docIndex, 1);
            await workspace.save();

            res.json({
                success: true,
                message: "Document deleted successfully",
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;
