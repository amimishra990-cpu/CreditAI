import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

router.post("/early-warning", async (req: Request, res: Response) => {
    try {
        const { workspaceId, financialData, companyInfo } = req.body;

        let data = financialData || {};
        let company = companyInfo || {};

        if (workspaceId) {
            const ws = await Workspace.findOne({ id: workspaceId });
            if (ws) {
                data = ws.extractedData || data;
                company = ws.company || company;
            }
        }

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are an Early Warning Risk Detection system for a bank.

COMPANY: ${JSON.stringify(company, null, 2)}
FINANCIAL DATA: ${JSON.stringify(data, null, 2)}

Scan for: sudden revenue drops, negative news, legal disputes, financial anomalies, market threats, regulatory issues.

Respond ONLY in this JSON format:
{
  "alerts": [
    {
      "id": 1,
      "type": "Financial/Legal/Market/News/Regulatory",
      "severity": "high/medium/low",
      "title": "Alert Title",
      "description": "Detailed description",
      "timestamp": "2024-12-15 08:30",
      "recommended_action": "What should be done",
      "acknowledged": false
    }
  ],
  "overallRiskTrend": "increasing/stable/decreasing",
  "summary": "brief summary of risk landscape"
}`,
                        },
                    ],
                },
            ],
        });

        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let result: any = { alerts: [], summary: text };

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { result = JSON.parse(jsonMatch[0]); }
            catch { result = { alerts: [], summary: text }; }
        }

        if (workspaceId) {
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                { $set: { earlyWarningAlerts: result.alerts || [] } }
            );
        }

        res.json({ success: true, ...result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
