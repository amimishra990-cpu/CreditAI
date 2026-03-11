import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { workspaces } from "./onboard.js";

const router = Router();

router.post("/orchestrate", async (req: Request, res: Response) => {
    try {
        const { workspaceId, agentResults, companyInfo, loanInfo } = req.body;

        let agents = agentResults || {};
        let company = companyInfo || {};
        let loan = loanInfo || {};

        if (workspaceId && workspaces[workspaceId]) {
            agents = workspaces[workspaceId].agentResults || agents;
            company = workspaces[workspaceId].company || company;
            loan = workspaces[workspaceId].loan || loan;
        }

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are the Central Orchestrator Agent for a credit appraisal system. You are a digital credit manager who synthesizes insights from multiple independent AI analysis tools.

COMPANY INFORMATION:
${JSON.stringify(company, null, 2)}

LOAN REQUEST:
${JSON.stringify(loan, null, 2)}

AGENT ANALYSIS RESULTS:
${JSON.stringify(agents, null, 2)}

Your tasks:
1. Combine insights from all 4 analysis agents
2. Identify and prioritize key risk signals
3. Generate a final credit assessment with explainable reasoning
4. Create a SWOT analysis for the company
5. Provide a clear loan recommendation

Respond ONLY in this exact JSON format:
{
  "overallRiskScore": 0,
  "riskLevel": "Low/Moderate/High/Critical",
  "recommendation": "Approve/Conditional Approval/Decline",
  "confidenceScore": 0.0,
  "explanations": [
    "reason 1 for the decision",
    "reason 2 for the decision"
  ],
  "keyRiskSignals": [
    { "signal": "description", "severity": "high/medium/low", "source": "agent name" }
  ],
  "strengths": ["strength 1"],
  "conditions": ["condition 1 if conditional approval"],
  "swot": {
    "strengths": ["s1"],
    "weaknesses": ["w1"],
    "opportunities": ["o1"],
    "threats": ["t1"]
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
            try {
                orchestratorResult = JSON.parse(jsonMatch[0]);
            } catch {
                orchestratorResult = { raw: text };
            }
        }

        // Store in workspace
        if (workspaceId && workspaces[workspaceId]) {
            workspaces[workspaceId].orchestratorResult = orchestratorResult;
        }

        res.json({
            success: true,
            orchestratorResult,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
