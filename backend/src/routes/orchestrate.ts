import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

router.post("/orchestrate", async (req: Request, res: Response) => {
    try {
        const { workspaceId, agentResults, companyInfo, loanInfo } = req.body;

        let agents = agentResults || {};
        let company = companyInfo || {};
        let loan = loanInfo || {};

        if (workspaceId) {
            const ws = await Workspace.findOne({ id: workspaceId });
            if (ws) {
                agents = ws.agentResults || agents;
                company = ws.company || company;
                loan = ws.loan || loan;
            }
        }

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are the Central Orchestrator Agent for a credit appraisal system.

COMPANY: ${JSON.stringify(company, null, 2)}
LOAN REQUEST: ${JSON.stringify(loan, null, 2)}
AGENT RESULTS: ${JSON.stringify(agents, null, 2)}

Synthesize all agent insights and produce a final credit decision.

Respond ONLY in this JSON format:
{
  "overallRiskScore": 0,
  "riskLevel": "Low/Moderate/High/Critical",
  "recommendation": "Approve/Conditional Approval/Decline",
  "confidenceScore": 0.0,
  "explanations": ["reason 1", "reason 2"],
  "keyRiskSignals": [{ "signal": "...", "severity": "high/medium/low", "source": "agent name" }],
  "strengths": ["strength 1"],
  "conditions": ["condition if conditional approval"],
  "swot": {
    "strengths": ["s1"], "weaknesses": ["w1"],
    "opportunities": ["o1"], "threats": ["t1"]
  },
  "confidenceBreakdown": [
    { "agent": "agent name", "confidence": 0.0, "weight": 0.25 }
  ],
  "loanRecommendation": {
    "approved": true,
    "recommendedAmount": "amount",
    "recommendedRate": "rate",
    "recommendedTenure": "tenure",
    "specialConditions": ["condition"]
  },
  "summary": "2-3 sentence executive summary"
}`,
                        },
                    ],
                },
            ],
        });

        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let orchestratorResult: any = { raw: text };

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { orchestratorResult = JSON.parse(jsonMatch[0]); }
            catch { orchestratorResult = { raw: text }; }
        }

        if (workspaceId) {
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                { $set: { orchestratorResult } }
            );
        }

        res.json({ success: true, orchestratorResult });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
