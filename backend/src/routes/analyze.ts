import { Router, Request, Response } from "express";
import { Workspace } from "../models/Workspace.js";
import { runCreditAnalysisWorkflow } from "../langgraph-workflow.js";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
    try {
        const { workspaceId, extractedData, companyInfo } = req.body;

        let data = extractedData || {};
        let company = companyInfo || {};
        let loan = {};

        if (workspaceId) {
            const ws = await Workspace.findOne({ id: workspaceId });
            if (ws) {
                data = ws.extractedData || data;
                company = ws.company || company;
                loan = ws.loan || {};
            }
        }

        // Run the full LangGraph credit analysis workflow
        // This executes 4 agents in parallel → orchestrator
        const result = await runCreditAnalysisWorkflow({
            companyInfo: company,
            extractedData: data,
            loanInfo: loan,
        });

        const agentResults = {
            documentAnalysis: result.documentAnalysis,
            financialAnalysis: result.financialAnalysis,
            researchAnalysis: result.researchAnalysis,
            promoterAnalysis: result.promoterAnalysis,
            completedAt: new Date().toISOString(),
        };

        if (workspaceId) {
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                {
                    $set: {
                        agentResults,
                        orchestratorResult: result.orchestratorResult,
                    },
                }
            );
        }

        res.json({
            success: true,
            agentResults,
            orchestratorResult: result.orchestratorResult,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
