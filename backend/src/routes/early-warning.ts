import { Router, Request, Response } from "express";
import { callGroqJSON, GROQ_MODEL_KIMI } from "../groq.js";
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

        const prompt = `You are an Early Warning Risk Detection system for a bank.

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
}`;

        const result = await callGroqJSON(GROQ_MODEL_KIMI, prompt, {
            temperature: 0.6,
            maxTokens: 4096,
        });

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
