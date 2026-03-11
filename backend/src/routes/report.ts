import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { workspaces } from "./onboard.js";

const router = Router();

router.post("/report", async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.body;

        let workspace: any = {};
        if (workspaceId && workspaces[workspaceId]) {
            workspace = workspaces[workspaceId];
        }

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are a Credit Appraisal Memo (CAM) generator for a bank. Generate a structured, professional credit report.

WORKSPACE DATA:
Company: ${JSON.stringify(workspace.company || {}, null, 2)}
Loan Details: ${JSON.stringify(workspace.loan || {}, null, 2)}
Extracted Financial Data: ${JSON.stringify(workspace.extractedData || {}, null, 2)}
Agent Analysis Results: ${JSON.stringify(workspace.agentResults || {}, null, 2)}
Orchestrator Decision: ${JSON.stringify(workspace.orchestratorResult || {}, null, 2)}
Early Warning Alerts: ${JSON.stringify(workspace.earlyWarningAlerts || [], null, 2)}

Generate a complete Credit Appraisal Memo with the following sections. Make it detailed and professional.

Respond ONLY in this exact JSON format:
{
  "reportTitle": "Credit Appraisal Memo - Company Name",
  "generatedAt": "ISO date string",
  "sections": {
    "companyOverview": {
      "title": "Company Overview",
      "content": "Detailed paragraph about the company..."
    },
    "financialAnalysis": {
      "title": "Financial Analysis",
      "content": "Detailed financial analysis...",
      "keyMetrics": [
        { "metric": "name", "value": "value", "assessment": "good/fair/poor" }
      ]
    },
    "promoterAssessment": {
      "title": "Promoter & Management Assessment",
      "content": "Assessment of promoters..."
    },
    "industryAnalysis": {
      "title": "Industry & Market Insights",
      "content": "Industry analysis..."
    },
    "riskAssessment": {
      "title": "Risk Assessment",
      "content": "Risk analysis...",
      "riskFactors": [
        { "factor": "name", "severity": "high/medium/low", "mitigation": "strategy" }
      ]
    },
    "swotAnalysis": {
      "title": "SWOT Analysis",
      "strengths": ["s1"],
      "weaknesses": ["w1"],
      "opportunities": ["o1"],
      "threats": ["t1"]
    },
    "loanRecommendation": {
      "title": "Final Loan Recommendation",
      "decision": "Approve/Conditional Approval/Decline",
      "content": "Detailed recommendation...",
      "conditions": ["condition 1"],
      "proposedTerms": {
        "amount": "loan amount",
        "rate": "interest rate",
        "tenure": "loan tenure",
        "collateral": "required collateral"
      }
    }
  },
  "executiveSummary": "2-3 sentence summary of the entire report"
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
            try {
                report = JSON.parse(jsonMatch[0]);
            } catch {
                report = { raw: text };
            }
        }

        // Store in workspace
        if (workspaceId && workspaces[workspaceId]) {
            workspaces[workspaceId].report = report;
        }

        res.json({
            success: true,
            report,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
