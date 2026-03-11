import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { Workspace } from "../models/Workspace.js";

const router = Router();

async function runAgent(agentName: string, prompt: string): Promise<any> {
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { return { agent: agentName, status: "complete", data: JSON.parse(jsonMatch[0]) }; }
            catch { return { agent: agentName, status: "complete", data: { summary: text } }; }
        }
        return { agent: agentName, status: "complete", data: { summary: text } };
    } catch (err: any) {
        return { agent: agentName, status: "error", error: err.message };
    }
}

router.post("/analyze", async (req: Request, res: Response) => {
    try {
        const { workspaceId, extractedData, companyInfo } = req.body;

        let data = extractedData || {};
        let company = companyInfo || {};

        if (workspaceId) {
            const ws = await Workspace.findOne({ id: workspaceId });
            if (ws) {
                data = ws.extractedData || data;
                company = ws.company || company;
            }
        }

        const dataStr = JSON.stringify(data, null, 2);
        const companyStr = JSON.stringify(company, null, 2);

        const [docAnalysis, finAnalysis, researchAnalysis, promoterAnalysis] = await Promise.all([
            runAgent("Document Analysis", `You are a Document Analysis AI. Analyze the extracted financial data.
Company: ${companyStr}
Extracted Data: ${dataStr}
Respond in JSON: { "keyValues": [{ "entity": "...", "value": "...", "confidence": 0.95 }], "keyFindings": ["..."], "documentQuality": "good/fair/poor", "completeness": 0.85, "summary": "..." }`),

            runAgent("Financial Analysis", `You are a Financial Analysis AI. Evaluate financial health.
Company: ${companyStr}
Financial Data: ${dataStr}
Respond in JSON: { "ratios": [{ "name": "...", "value": 0.0, "benchmark": 0.0, "status": "good/warning/critical" }], "profitability": { "score": 0, "assessment": "..." }, "liquidity": { "score": 0, "assessment": "..." }, "solvency": { "score": 0, "assessment": "..." }, "repaymentCapability": "strong/adequate/weak", "overallHealthScore": 0, "summary": "..." }`),

            runAgent("Research Agent", `You are a Research Agent for credit appraisal. Analyze external factors.
Company: ${companyStr}
Sector: ${(company as any).sector || "unknown"}
Respond in JSON: { "industryOutlook": "positive/neutral/negative", "industryGrowthRate": "X%", "marketSentiment": "positive/neutral/negative", "keyTrends": ["..."], "regulatoryRisks": ["..."], "competitivePosition": "strong/moderate/weak", "newsHighlights": [{ "title": "...", "sentiment": "...", "impact": "..." }], "litigationFlags": [], "summary": "..." }`),

            runAgent("Promoter Analysis", `You are a Promoter Analysis AI. Assess promoter risk profile.
Company: ${companyStr}
Respond in JSON: { "overallRisk": "low/medium/high", "fraudProbability": "X%", "reputationScore": 0, "riskFlags": ["..."], "promoterStrengths": ["..."], "relatedEntityRisk": "low/medium/high", "recommendedChecks": ["..."], "summary": "..." }`),
        ]);

        const agentResults = {
            documentAnalysis: docAnalysis,
            financialAnalysis: finAnalysis,
            researchAnalysis,
            promoterAnalysis,
            completedAt: new Date().toISOString(),
        };

        if (workspaceId) {
            await Workspace.findOneAndUpdate(
                { id: workspaceId },
                { $set: { agentResults } }
            );
        }

        res.json({ success: true, agentResults });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
