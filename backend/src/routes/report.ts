import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

router.post("/report", async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.body;

        let ws: any = null;
        if (workspaceId) {
            ws = await Workspace.findOne({ id: workspaceId });
        }

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are a Credit Appraisal Memo (CAM) generator. Generate a structured, professional credit report.

Company: ${JSON.stringify(ws?.company || {}, null, 2)}
Loan Details: ${JSON.stringify(ws?.loan || {}, null, 2)}
Extracted Financial Data: ${JSON.stringify(ws?.extractedData || {}, null, 2)}
Agent Analysis: ${JSON.stringify(ws?.agentResults || {}, null, 2)}
Orchestrator Decision: ${JSON.stringify(ws?.orchestratorResult || {}, null, 2)}
Early Warning Alerts: ${JSON.stringify(ws?.earlyWarningAlerts || [], null, 2)}

Respond ONLY in this JSON format:
{
  "reportTitle": "Credit Appraisal Memo - Company Name",
  "generatedAt": "ISO date string",
  "sections": {
    "companyOverview": { "title": "Company Overview", "content": "..." },
    "financialAnalysis": {
      "title": "Financial Analysis",
      "content": "...",
      "keyMetrics": [{ "metric": "name", "value": "value", "assessment": "good/fair/poor" }]
    },
    "promoterAssessment": { "title": "Promoter & Management Assessment", "content": "..." },
    "industryAnalysis": { "title": "Industry & Market Insights", "content": "..." },
    "riskAssessment": {
      "title": "Risk Assessment",
      "content": "...",
      "riskFactors": [{ "factor": "name", "severity": "high/medium/low", "mitigation": "strategy" }]
    },
    "swotAnalysis": {
      "title": "SWOT Analysis",
      "strengths": ["s1"], "weaknesses": ["w1"],
      "opportunities": ["o1"], "threats": ["t1"]
    },
    "loanRecommendation": {
      "title": "Final Loan Recommendation",
      "decision": "Approve/Conditional Approval/Decline",
      "content": "...",
      "conditions": ["condition 1"],
      "proposedTerms": {
        "amount": "loan amount", "rate": "interest rate",
        "tenure": "loan tenure", "collateral": "required collateral"
      }
    }
  },
  "executiveSummary": "2-3 sentence summary"
}`,
                        },
                    ],
                },
            ],
        });

        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let report: any = { raw: text };

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { report = JSON.parse(jsonMatch[0]); }
            catch { report = { raw: text }; }
        }

        if (workspaceId) {
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                { $set: { report } }
            );
        }

        res.json({ success: true, report });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
