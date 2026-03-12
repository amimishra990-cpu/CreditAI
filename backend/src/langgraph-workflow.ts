import { Annotation, StateGraph } from "@langchain/langgraph";
import { callGroqJSON } from "./groq.js";
import { GROQ_MODEL_VERSATILE, GROQ_MODEL_KIMI } from "./groq.js";
import {
    DOCUMENT_ANALYSIS_FORMULAS,
    FINANCIAL_ANALYSIS_FORMULAS,
    RESEARCH_AGENT_FORMULAS,
    PROMOTER_ANALYSIS_FORMULAS,
    ORCHESTRATOR_FORMULAS,
} from "./mathFramework.js";

// ── LangGraph State Schema ─────────────────────────────────────────────────

const CreditAnalysisState = Annotation.Root({
    // Inputs
    companyInfo: Annotation<Record<string, any>>({ reducer: (_, b) => b, default: () => ({}) }),
    extractedData: Annotation<Record<string, any>>({ reducer: (_, b) => b, default: () => ({}) }),
    loanInfo: Annotation<Record<string, any>>({ reducer: (_, b) => b, default: () => ({}) }),

    // Agent outputs
    documentAnalysis: Annotation<Record<string, any> | null>({ reducer: (_, b) => b, default: () => null }),
    financialAnalysis: Annotation<Record<string, any> | null>({ reducer: (_, b) => b, default: () => null }),
    researchAnalysis: Annotation<Record<string, any> | null>({ reducer: (_, b) => b, default: () => null }),
    promoterAnalysis: Annotation<Record<string, any> | null>({ reducer: (_, b) => b, default: () => null }),

    // Orchestrator output
    orchestratorResult: Annotation<Record<string, any> | null>({ reducer: (_, b) => b, default: () => null }),
});

type CreditState = typeof CreditAnalysisState.State;

// ── Agent Node Functions ────────────────────────────────────────────────────

async function documentAnalysisNode(state: CreditState): Promise<Partial<CreditState>> {
    const dataStr = JSON.stringify(state.extractedData, null, 2);
    const companyStr = JSON.stringify(state.companyInfo, null, 2);

    const prompt = `You are a Document Analysis AI. Analyze the extracted financial data.

${DOCUMENT_ANALYSIS_FORMULAS}

Company: ${companyStr}
Extracted Data: ${dataStr}

Apply the Field Reliability Score (FRS), Extraction Confidence (EC), and overall Confidence formulas above to compute scores for each extracted field.

Respond in JSON: { "keyValues": [{ "entity": "...", "value": "...", "confidence": 0.95, "fieldReliabilityScore": 0.0 }], "keyFindings": ["..."], "documentQuality": "good/fair/poor", "documentQualityScore": 0.0, "extractionConfidence": 0.0, "overallConfidence": 0.0, "confidenceBreakdown": { "extractionAccuracy": 0.0, "documentQuality": 0.0, "schemaMappingAccuracy": 0.0, "crossDocConsistency": 0.0 }, "completeness": 0.85, "summary": "..." }`;

    try {
        const data = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
        return { documentAnalysis: { agent: "Document Analysis", status: "complete", data } };
    } catch (err: any) {
        return { documentAnalysis: { agent: "Document Analysis", status: "error", error: err.message } };
    }
}

async function financialAnalysisNode(state: CreditState): Promise<Partial<CreditState>> {
    const dataStr = JSON.stringify(state.extractedData, null, 2);
    const companyStr = JSON.stringify(state.companyInfo, null, 2);

    const prompt = `You are a Financial Analysis AI. Evaluate financial health.

${FINANCIAL_ANALYSIS_FORMULAS}

Company: ${companyStr}
Financial Data: ${dataStr}

Compute ALL ratios (DER, PM, LR, RCS) and the composite Financial Health Score (FHS) using the exact formulas above. Normalize FHS to a 0-100 scale.

Respond in JSON: { "ratios": [{ "name": "...", "value": 0.0, "benchmark": 0.0, "status": "good/warning/critical" }], "profitability": { "score": 0, "assessment": "..." }, "liquidity": { "score": 0, "assessment": "..." }, "solvency": { "score": 0, "assessment": "..." }, "repaymentCapability": "strong/adequate/weak", "repaymentCapacityScore": 0.0, "financialHealthScore": 0.0, "overallHealthScore": 0, "summary": "..." }`;

    try {
        const data = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
        return { financialAnalysis: { agent: "Financial Analysis", status: "complete", data } };
    } catch (err: any) {
        return { financialAnalysis: { agent: "Financial Analysis", status: "error", error: err.message } };
    }
}

async function researchAgentNode(state: CreditState): Promise<Partial<CreditState>> {
    const companyStr = JSON.stringify(state.companyInfo, null, 2);
    const sector = (state.companyInfo as any)?.sector || "unknown";

    const prompt = `You are a Research Agent for credit appraisal. Analyze external factors.

${RESEARCH_AGENT_FORMULAS}

Company: ${companyStr}
Sector: ${sector}

Compute the Industry Risk Score (IRS) using the Coefficient of Variation formula above. Also compute the Market Sentiment Score (MSS).

Respond in JSON: { "industryOutlook": "positive/neutral/negative", "industryGrowthRate": "X%", "meanGrowth": 0.0, "industryVolatility": 0.0, "industryRiskScore": 0.0, "marketSentiment": "positive/neutral/negative", "marketSentimentScore": 0.0, "sentimentBreakdown": { "positiveMentions": 0, "negativeMentions": 0, "totalMentions": 0 }, "keyTrends": ["..."], "regulatoryRisks": ["..."], "competitivePosition": "strong/moderate/weak", "newsHighlights": [{ "title": "...", "sentiment": "...", "impact": "..." }], "litigationFlags": [], "summary": "..." }`;

    try {
        const data = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
        return { researchAnalysis: { agent: "Research Agent", status: "complete", data } };
    } catch (err: any) {
        return { researchAnalysis: { agent: "Research Agent", status: "error", error: err.message } };
    }
}

async function promoterAnalysisNode(state: CreditState): Promise<Partial<CreditState>> {
    const companyStr = JSON.stringify(state.companyInfo, null, 2);

    const prompt = `You are a Promoter Analysis AI. Assess promoter risk profile.

${PROMOTER_ANALYSIS_FORMULAS}

Company: ${companyStr}

Compute the Promoter Risk Index (PRI) using the exact formula above with F (Fraud Risk), L (Litigation Score), and R (Reputation Score).

Respond in JSON: { "overallRisk": "low/medium/high", "fraudRisk": 0.0, "fraudProbability": "X%", "litigationScore": 0.0, "reputationScore": 0.0, "promoterRiskIndex": 0.0, "riskFlags": ["..."], "promoterStrengths": ["..."], "relatedEntityRisk": "low/medium/high", "recommendedChecks": ["..."], "summary": "..." }`;

    try {
        const data = await callGroqJSON(GROQ_MODEL_VERSATILE, prompt);
        return { promoterAnalysis: { agent: "Promoter Analysis", status: "complete", data } };
    } catch (err: any) {
        return { promoterAnalysis: { agent: "Promoter Analysis", status: "error", error: err.message } };
    }
}

async function orchestratorNode(state: CreditState): Promise<Partial<CreditState>> {
    const agents = {
        documentAnalysis: state.documentAnalysis,
        financialAnalysis: state.financialAnalysis,
        researchAnalysis: state.researchAnalysis,
        promoterAnalysis: state.promoterAnalysis,
    };

    const prompt = `You are the Central Orchestrator Agent for a credit appraisal system.

${ORCHESTRATOR_FORMULAS}

COMPANY: ${JSON.stringify(state.companyInfo, null, 2)}
LOAN REQUEST: ${JSON.stringify(state.loanInfo, null, 2)}
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

    try {
        const data = await callGroqJSON(GROQ_MODEL_KIMI, prompt, { temperature: 0.6, maxTokens: 4096 });
        return { orchestratorResult: data };
    } catch (err: any) {
        return { orchestratorResult: { error: err.message } };
    }
}

// ── Build the LangGraph Workflow ────────────────────────────────────────────

function buildCreditAnalysisGraph() {
    const graph = new StateGraph(CreditAnalysisState)
        .addNode("documentAnalysis", documentAnalysisNode)
        .addNode("financialAnalysis", financialAnalysisNode)
        .addNode("researchAgent", researchAgentNode)
        .addNode("promoterAnalysis", promoterAnalysisNode)
        .addNode("orchestrator", orchestratorNode)

        // Fan-out: START → all 4 analysis agents in parallel
        .addEdge("__start__", "documentAnalysis")
        .addEdge("__start__", "financialAnalysis")
        .addEdge("__start__", "researchAgent")
        .addEdge("__start__", "promoterAnalysis")

        // Fan-in: all 4 agents → orchestrator
        .addEdge("documentAnalysis", "orchestrator")
        .addEdge("financialAnalysis", "orchestrator")
        .addEdge("researchAgent", "orchestrator")
        .addEdge("promoterAnalysis", "orchestrator")

        // Orchestrator → END
        .addEdge("orchestrator", "__end__");

    return graph.compile();
}

// Singleton compiled graph
let _compiledGraph: ReturnType<typeof buildCreditAnalysisGraph> | null = null;

function getGraph() {
    if (!_compiledGraph) {
        _compiledGraph = buildCreditAnalysisGraph();
    }
    return _compiledGraph;
}

/**
 * Run the full credit analysis LangGraph workflow.
 * Returns the final state containing all agent results + orchestrator decision.
 */
export async function runCreditAnalysisWorkflow(input: {
    companyInfo: Record<string, any>;
    extractedData: Record<string, any>;
    loanInfo: Record<string, any>;
}): Promise<CreditState> {
    const graph = getGraph();
    const result = await graph.invoke({
        companyInfo: input.companyInfo,
        extractedData: input.extractedData,
        loanInfo: input.loanInfo,
    });
    return result as CreditState;
}
