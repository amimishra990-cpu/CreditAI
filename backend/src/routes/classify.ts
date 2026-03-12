import { Router, Request, Response } from "express";
import { callGroqJSON, GROQ_MODEL_VERSATILE } from "../groq.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

router.post("/classify", async (req: Request, res: Response) => {
    try {
        const { workspaceId, documents } = req.body;

        if (!documents || !Array.isArray(documents)) {
            res.status(400).json({ error: "documents array is required" });
            return;
        }

        const results = [];

        for (const doc of documents) {
            let structuredData = null;
            try {
                const prompt = `You are a financial data extraction AI. Document classified as "${doc.classification}". Extract structured financial data.

DOCUMENT TEXT:
${(doc.extractedText || "").substring(0, 8000)}

Respond ONLY in this JSON format:
{
  "revenue": null, "netProfit": null, "totalDebt": null,
  "totalAssets": null, "totalLiabilities": null, "cashFlow": null,
  "ebitda": null, "ebitdaMargin": null, "debtToEquity": null,
  "currentRatio": null, "promoterShareholding": null,
  "publicShareholding": null, "workingCapital": null,
  "interestCoverageRatio": null, "netProfitMargin": null,
  "returnOnEquity": null, "operatingProfit": null,
  "borrowings": null, "otherKeyMetrics": {}
}`;

                structuredData = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
            } catch (err: any) {
                structuredData = { error: err.message };
            }

            results.push({
                documentId: doc.id,
                classification: doc.classification,
                analystVerified: true,
                structuredData,
            });
        }

        // Merge structured data and persist to MongoDB
        if (workspaceId) {
            const merged: Record<string, any> = {};
            for (const r of results) {
                if (r.structuredData && typeof r.structuredData === "object") {
                    for (const [key, val] of Object.entries(r.structuredData)) {
                        if (val !== null && val !== undefined && key !== "error" && key !== "raw") {
                            merged[key] = val;
                        }
                    }
                }
            }

            // Update classification on individual document records too
            for (const doc of documents) {
                await Workspace.findOneAndUpdate(
                    { id: workspaceId, "documents.id": doc.id },
                    {
                        $set: {
                            "documents.$.classification": doc.classification,
                            "documents.$.analystVerified": true,
                        },
                    }
                );
            }

            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                { $set: { classifications: results, extractedData: merged } }
            );
        }

        res.json({ success: true, classifications: results });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
