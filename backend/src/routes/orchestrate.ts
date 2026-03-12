import { Router, Request, Response } from "express";
import { callGroqJSON, GROQ_MODEL_KIMI } from "../groq.js";
import { Workspace } from "../models/Workspace.js";
import { ORCHESTRATOR_FORMULAS } from "../mathFramework.js";

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

        const prompt = `You are the Central Orchestrator Agent for a credit appraisal system.

${ORCHESTRATOR_FORMULAS}

COMPANY: ${JSON.stringify(company, null, 2)}
LOAN REQUEST: ${JSON.stringify(loan, null, 2)}
AGENT RESULTS: ${JSON.stringify(agents, null, 2)}

Synthesize all agent insights and produce a final credit decision.
Use the mathematical framework above to compute V_total, CS, S_final, CRS, and the final Decision.

Respond ONLY in this JSON format:
{
  "overallRiskScore": 0,
  "riskLevel": "Low/Moderate/High/Critical",
  "recommendation": "Approve/Conditional Approval/Decline",
  "confidenceScore": 0.0,
  "agentValueAggregation": 0.0,
  "agentCoordinationScore": 0.0,
  "finalSystemScore": 0.0,
  "creditRiskScore": 0.0,
  "decisionThreshold": { "T1": 70, "T2": 40, "appliedCRS": 0.0 },
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
}`;

        const orchestratorResult = await callGroqJSON(GROQ_MODEL_KIMI, prompt, {
            temperature: 0.6,
            maxTokens: 4096,
        });

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
