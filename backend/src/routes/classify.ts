import { Router, Response } from "express";
import { callGroqJSON, GROQ_MODEL_VERSATILE } from "../groq.js";
import { Workspace } from "../models/Workspace.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { auditLog } from "../middleware/audit.js";

const router = Router();

router.post(
    "/classify",
    authenticate,
    auditLog("classify_documents", "document"),
    async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId, documents } = req.body;

            if (!workspaceId) {
                res.status(400).json({ error: "workspaceId is required" });
                return;
            }

            if (!documents || !Array.isArray(documents)) {
                res.status(400).json({ error: "documents array is required" });
                return;
            }

            const workspace = await Workspace.findOne({ id: workspaceId });
            if (!workspace) {
                res.status(404).json({ error: "Workspace not found" });
                return;
            }

            const classifications = [];

            for (const doc of documents) {
                let structuredData = null;
                try {
                    const prompt = `You are a financial data extraction AI. Document classified as "${doc.classification}". Extract structured financial data.

DOCUMENT TEXT:
${(doc.extractedText || "").substring(0, 8000)}

Respond ONLY in this JSON format:
{
  "revenue": null, "netIncome": null, "totalAssets": null,
  "totalLiabilities": null, "equity": null, "cashFlow": null,
  "debtToEquityRatio": null, "currentRatio": null,
  "interestCoverageRatio": null, "netProfitMargin": null,
  "returnOnEquity": null, "operatingProfit": null,
  "borrowings": null, "otherKeyMetrics": {}
}`;

                    structuredData = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
                } catch (err: any) {
                    structuredData = { error: err.message };
                }

                classifications.push({
                    documentId: doc.id,
                    classification: doc.classification,
                    analystVerified: doc.analystVerified || false,
                    structuredData,
                    processedAt: new Date().toISOString(),
                });

                // Update document in workspace
                const docIndex = workspace.documents.findIndex((d: any) => d.id === doc.id);
                if (docIndex !== -1) {
                    workspace.documents[docIndex].classification = doc.classification;
                    workspace.documents[docIndex].analystVerified = doc.analystVerified || false;
                }
            }

            // Save classifications to workspace
            workspace.classifications = classifications;
            workspace.updatedAt = new Date();
            await workspace.save();

            res.json({
                success: true,
                message: "Classifications saved successfully",
                classifications,
            });
        } catch (error: any) {
            console.error("Classification error:", error);
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;
