/**
 * Mathematical Framework for AI-Based Multi-Agent Credit Risk Analysis System
 *
 * Contains all formulas as system prompt strings, organized per agent.
 * These are injected into each Gemini agent prompt so the AI uses the
 * exact equations when computing scores.
 */

// ── Document Analysis Agent Formulas (Equations 1–10) ──────────────────────
export const DOCUMENT_ANALYSIS_FORMULAS = `
MATHEMATICAL FRAMEWORK — You MUST apply these formulas when computing scores:

1. Field Reliability Score:
   FRS = Pm × Qd
   Where Pm = model confidence probability for extracted field, Qd = document quality score (0-1).

2. Document Extraction Confidence (average over all extracted fields):
   EC = (1/n) × Σ(FRS_i)  for i = 1..n
   Where n = number of extracted fields.

3. Overall Confidence Score:
   Confidence = w1×E + w2×D + w3×S + w4×C
   Where w1+w2+w3+w4 = 1, and:
   - E = Extraction Accuracy = (Σ p_i) / n   (average confidence of extracted fields)
   - D = Document Quality = 1 − (OCR_Errors / Total_Words)
   - S = Schema Mapping Accuracy = Correctly_Mapped_Fields / Total_Extracted_Fields
   - C = Cross-Document Consistency = 1 − |V1 − V2| / max(V1, V2)

Use weights: w1=0.35, w2=0.25, w3=0.20, w4=0.20.
Report each sub-score (E, D, S, C) and the final Confidence score in your response.
`;

// ── Financial Analysis Agent Formulas (Equations 11–15) ────────────────────
export const FINANCIAL_ANALYSIS_FORMULAS = `
MATHEMATICAL FRAMEWORK — You MUST compute these ratios and scores using the exact formulas:

1. Debt-to-Equity Ratio:
   DER = Total_Debt / Shareholder_Equity

2. Profit Margin:
   PM = Net_Profit / Revenue

3. Liquidity Ratio:
   LR = Current_Assets / Current_Liabilities

4. Repayment Capacity Score:
   RCS = Operating_Cashflow / Debt_Obligations

5. Financial Health Score (composite):
   FHS = α1 × (1/DER) + α2 × PM + α3 × LR + α4 × RCS
   Where α1=0.25, α2=0.25, α3=0.25, α4=0.25 (equal weights).

For each ratio, compare against these benchmarks:
- DER: < 1.0 = good, 1.0-2.0 = fair, > 2.0 = poor
- PM: > 15% = good, 5-15% = fair, < 5% = poor
- LR: > 1.5 = good, 1.0-1.5 = fair, < 1.0 = poor
- RCS: > 1.5 = strong, 1.0-1.5 = adequate, < 1.0 = weak

Report all individual ratios AND the composite FHS score (normalized 0-100).
`;

// ── Research Agent Formulas (Equations 16–18, 24) ──────────────────────────
export const RESEARCH_AGENT_FORMULAS = `
MATHEMATICAL FRAMEWORK — You MUST apply these formulas when computing industry risk and sentiment:

1. Mean Industry Growth:
   μ = (1/n) × Σ(g_i)  for i = 1..n
   Where g_i = industry growth rate at time/period i.

2. Industry Volatility:
   σ = sqrt( (1/n) × Σ(g_i − μ)² )

3. Industry Risk Score (Coefficient of Variation):
   IRS = σ / μ
   Interpretation: IRS < 0.3 = low risk, 0.3-0.6 = moderate risk, > 0.6 = high risk.

4. Market Sentiment Score:
   MSS = (Np − Nn) / Nt
   Where Np = positive mentions, Nn = negative mentions, Nt = total mentions.
   MSS ranges from -1 (entirely negative) to +1 (entirely positive).

Report the computed IRS, MSS, and all intermediate values (μ, σ, Np, Nn, Nt).
`;

// ── Promoter Analysis Agent Formulas (Equations 19–23) ─────────────────────
export const PROMOTER_ANALYSIS_FORMULAS = `
MATHEMATICAL FRAMEWORK — You MUST apply these formulas when assessing promoter risk:

1. Fraud Risk:
   F = Fraud_Cases / Maximum_Fraud_Events
   Normalize to 0-1 range.

2. Litigation Score:
   L = Active_Litigation / Total_Entities
   Normalize to 0-1 range.

3. Reputation Score:
   R = 1 − (Negative_Mentions / Total_Mentions)
   R ranges from 0 (entirely negative) to 1 (entirely positive).

4. Promoter Risk Index (composite):
   PRI = wf×F + wl×L + wr×(1 − R)
   Where wf + wl + wr = 1. Use weights: wf=0.40, wl=0.30, wr=0.30.
   PRI ranges from 0 (no risk) to 1 (maximum risk).
   Interpretation: PRI < 0.2 = low risk, 0.2-0.5 = medium risk, > 0.5 = high risk.

Report F, L, R, and the final PRI score.
`;

// ── Orchestrator Agent Formulas (Equations 25–30) ──────────────────────────
export const ORCHESTRATOR_FORMULAS = `
MATHEMATICAL FRAMEWORK — You MUST apply these formulas for the final credit decision:

1. Agent Value Aggregation:
   V_total = Σ(w_i × V_i)
   Where V_i = score from agent i, w_i = importance weight.
   Use weights: Document Analysis=0.15, Financial Analysis=0.35, Research Agent=0.20, Promoter Analysis=0.30.

2. Agent Coordination Score (measures agreement between agents):
   CS = 1 − (σ_A / μ_A)
   Where σ_A = standard deviation of agent scores, μ_A = mean agent score.
   CS close to 1 means agents agree; close to 0 means high disagreement.

3. Final System Score:
   S_final = V_total × CS

4. Bayesian Evidence Aggregation (if each agent provides probability of loan safety P_i):
   P_final = Π(P_i) / [Π(P_i) + Π(1 − P_i)]

5. Final Credit Score:
   CRS = S_financial − λ1×IRS − λ2×PRI
   Where S_financial = Financial Health Score, IRS = Industry Risk Score, PRI = Promoter Risk Index.
   Use penalty weights: λ1=0.3, λ2=0.3.

6. Loan Decision Rule:
   - Approve:    CRS ≥ 70
   - Review:     40 < CRS < 70
   - Reject:     CRS ≤ 40

You MUST report: V_total, CS, S_final, CRS, and the final Decision (Approve/Review/Reject) with the threshold comparison.
`;

// ── Report Generation Reference ────────────────────────────────────────────
export const REPORT_FRAMEWORK_REFERENCE = `
MATHEMATICAL FRAMEWORK REFERENCE — When generating the credit report, cite these key formulas:
- Financial Health Score (FHS) = α1/DER + α2×PM + α3×LR + α4×RCS
- Industry Risk Score (IRS) = σ/μ (Coefficient of Variation of industry growth)
- Promoter Risk Index (PRI) = wf×F + wl×L + wr×(1−R)
- Final Credit Score (CRS) = S_financial − λ1×IRS − λ2×PRI
- Decision Rule: Approve (CRS≥70), Review (40<CRS<70), Reject (CRS≤40)

Include specific computed values for each formula in the relevant sections of the report.
`;
