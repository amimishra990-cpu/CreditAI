import { Router, Request, Response } from "express";
import { ai, MODEL } from "../gemini.js";
import { workspaces } from "./onboard.js";

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
            try {
                return { agent: agentName, status: "complete", data: JSON.parse(jsonMatch[0]) };
            } catch {
                return { agent: agentName, status: "complete", data: { summary: text } };
            }
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

        if (workspaceId && workspaces[workspaceId]) {
            data = workspaces[workspaceId].extractedData || data;
            company = workspaces[workspaceId].company || company;
        }

        const dataStr = JSON.stringify(data, null, 2);
        const companyStr = JSON.stringify(company, null, 2);

        // Run all 4 agents in parallel
        const [docAnalysis, finAnalysis, researchAnalysis, promoterAnalysis] = await Promise.all([
            // 1. Document Analysis Tool
            runAgent("Document Analysis", `You are a Document Analysis AI for credit appraisal. Analyze the following extracted financial data and provide key findings.

Company: ${companyStr}
Extracted Data: ${dataStr}

Respond in this JSON format:
{
  "keyValues": [
    { "entity": "field name", "value": "extracted value", "confidence": 0.95 }
  ],
  "keyFindings": ["finding 1", "finding 2"],
  "documentQuality": "good/fair/poor",
  "completeness": 0.85,
  "summary": "brief summary"
}`),

            // 2. Financial Analysis Tool
            runAgent("Financial Analysis", `You are a Financial Analysis AI for credit appraisal. Evaluate the company's financial health from the data below.

Company: ${companyStr}
Financial Data: ${dataStr}

Calculate and assess:
- Debt-to-equity ratio
- Profit margins
- Liquidity ratios
- Repayment capability
- Cash flow adequacy

Respond in this JSON format:
{
  "ratios": [
    { "name": "ratio name", "value": 0.0, "benchmark": 0.0, "status": "good/warning/critical" }
  ],
  "profitability": { "score": 0, "assessment": "..." },
  "liquidity": { "score": 0, "assessment": "..." },
  "solvency": { "score": 0, "assessment": "..." },
  "repaymentCapability": "strong/adequate/weak",
  "overallHealthScore": 0,
  "summary": "brief summary"
}`),

            // 3. Research Agent
            runAgent("Research Agent", `You are a Research Agent for credit appraisal. Based on the company information, provide insights about external factors.

Company: ${companyStr}
Sector: ${company.sector || "unknown"}

Analyze and report on:
- Industry trends and outlook
- Likely market sentiment
- Potential litigation risks
- Regulatory environment
- Competitive landscape

Respond in this JSON format:
{
  "industryOutlook": "positive/neutral/negative",
  "industryGrowthRate": "X%",
  "marketSentiment": "positive/neutral/negative",
  "keyTrends": ["trend 1", "trend 2"],
  "regulatoryRisks": ["risk 1"],
  "competitivePosition": "strong/moderate/weak",
  "newsHighlights": [
    { "title": "headline", "sentiment": "positive/negative/neutral", "impact": "high/medium/low" }
  ],
  "litigationFlags": [],
  "summary": "brief summary"
}`),

            // 4. Promoter Analysis Tool
            runAgent("Promoter Analysis", `You are a Promoter Analysis AI for credit appraisal. Assess the risk profile of the company's promoters/directors.

Company: ${companyStr}

Evaluate:
- Promoter background and reputation
- Potential fraud indicators
- Litigation history likelihood
- Related entity risk
- Financial misconduct signals

Respond in this JSON format:
{
  "overallRisk": "low/medium/high",
  "fraudProbability": "X%",
  "reputationScore": 0,
  "riskFlags": ["flag 1"],
  "promoterStrengths": ["strength 1"],
  "relatedEntityRisk": "low/medium/high",
  "recommendedChecks": ["check 1"],
  "summary": "brief summary"
}`),
        ]);

        const agentResults = {
            documentAnalysis: docAnalysis,
            financialAnalysis: finAnalysis,
            researchAnalysis: researchAnalysis,
            promoterAnalysis: promoterAnalysis,
            completedAt: new Date().toISOString(),
        };

        // Store in workspace
        if (workspaceId && workspaces[workspaceId]) {
            workspaces[workspaceId].agentResults = agentResults;
        }

        res.json({
            success: true,
            agentResults,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
