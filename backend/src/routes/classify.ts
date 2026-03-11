import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { workspaces } from "./onboard.js";

const router = Router();

// Human-in-the-loop classification correction + schema mapping
router.post("/classify", async (req: Request, res: Response) => {
    try {
        const { workspaceId, documents } = req.body;
        // documents: [{ id, classification, extractedText }]

        if (!documents || !Array.isArray(documents)) {
            res.status(400).json({ error: "documents array is required" });
            return;
        }

        const results = [];

        for (const doc of documents) {
            // Update classification if the analyst corrected it
            if (workspaceId && workspaces[workspaceId]) {
                const stored = workspaces[workspaceId].documents.find((d: any) => d.id === doc.id);
                if (stored && doc.classification) {
                    stored.classification = doc.classification;
                    stored.analystVerified = true;
                }
            }

            // Extract structured financial data via Gemini
            let structuredData = null;
            try {
                const response = await ai.models.generateContent({
                    model: MODEL,
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `You are a financial data extraction AI. Given the following extracted text from a document classified as "${doc.classification}", extract structured financial data.

DOCUMENT TEXT:
${(doc.extractedText || "").substring(0, 8000)}

Extract any of the following fields that are present. If a field is not found, set it to null.

Respond ONLY in this exact JSON format:
{
  "revenue": null,
  "netProfit": null,
  "totalDebt": null,
  "totalAssets": null,
  "totalLiabilities": null,
  "cashFlow": null,
  "ebitda": null,
  "ebitdaMargin": null,
  "debtToEquity": null,
  "currentRatio": null,
  "promoterShareholding": null,
  "publicShareholding": null,
  "workingCapital": null,
  "interestCoverageRatio": null,
  "netProfitMargin": null,
  "returnOnEquity": null,
  "operatingProfit": null,
  "borrowings": null,
  "otherKeyMetrics": {}
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
                        structuredData = JSON.parse(jsonMatch[0]);
                    } catch {
                        structuredData = { raw: text };
                    }
                }
            } catch (err: any) {
                console.error("Schema mapping error:", err.message);
                structuredData = { error: err.message };
            }

            results.push({
                documentId: doc.id,
                classification: doc.classification,
                analystVerified: true,
                structuredData,
            });
        }

        // Store extracted data in workspace
        if (workspaceId && workspaces[workspaceId]) {
            workspaces[workspaceId].classifications = results;
            // Merge all structured data
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
            workspaces[workspaceId].extractedData = merged;
        }

        res.json({
            success: true,
            classifications: results,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
