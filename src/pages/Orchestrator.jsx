import { CheckCircle, AlertTriangle, ArrowRight, Download, Printer } from 'lucide-react';
import RiskGauge from '../components/ui/RiskGauge';
import { orchestratorResult, companyProfile } from '../data/mockData';
import './Orchestrator.css';

export default function Orchestrator() {
    const r = orchestratorResult;

    return (
        <div className="orchestrator page-enter">
            <div className="orchestrator__header">
                <div>
                    <h1 className="orchestrator__title">Orchestrator — CAM Report</h1>
                    <p className="orchestrator__subtitle">Central AI agent synthesis and Credit Appraisal Memo</p>
                </div>
                <div className="orchestrator__actions">
                    <button className="orchestrator__btn orchestrator__btn--secondary" onClick={() => window.print()}>
                        <Printer size={16} /> Print
                    </button>
                    <button className="orchestrator__btn orchestrator__btn--primary">
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Top row: Risk Gauge + Decision */}
            <div className="orchestrator__top-row">
                <div className="orchestrator__gauge-card glass-card">
                    <RiskGauge score={r.overallRiskScore} size={200} label="Overall Risk Score" />
                    <div className="orchestrator__risk-level">
                        Risk Level: <strong>{r.riskLevel}</strong>
                    </div>
                </div>

                <div className="orchestrator__decision-card glass-card">
                    <div className="orchestrator__decision-badge" data-rec={r.recommendation.toLowerCase().replace(/\s/g, '-')}>
                        {r.recommendation === 'Conditional Approval' && <AlertTriangle size={24} />}
                        {r.recommendation === 'Approved' && <CheckCircle size={24} />}
                        {!['Conditional Approval', 'Approved'].includes(r.recommendation) && <AlertTriangle size={24} />}
                        <span>{r.recommendation}</span>
                    </div>
                    <div className="orchestrator__confidence">
                        <span className="orchestrator__confidence-label">AI Confidence</span>
                        <div className="orchestrator__confidence-bar-wrap">
                            <div className="orchestrator__confidence-bar" style={{ width: `${r.confidenceScore * 100}%` }} />
                        </div>
                        <span className="orchestrator__confidence-value">{(r.confidenceScore * 100).toFixed(0)}%</span>
                    </div>

                    <div className="orchestrator__agent-confidence">
                        {r.confidenceBreakdown.map((a, i) => (
                            <div key={i} className="orchestrator__agent-row">
                                <span className="orchestrator__agent-name">{a.agent}</span>
                                <div className="orchestrator__agent-bar-wrap">
                                    <div className="orchestrator__agent-bar" style={{ width: `${a.confidence * 100}%` }} />
                                </div>
                                <span className="orchestrator__agent-value">{(a.confidence * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className="orchestrator__insights glass-card">
                <h3 className="orchestrator__section-title">Key Insights</h3>
                <ul className="orchestrator__insight-list">
                    {r.keyInsights.map((ins, i) => (
                        <li key={i} className="orchestrator__insight">
                            <ArrowRight size={14} className="orchestrator__insight-icon" />
                            <span>{ins}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conditions */}
            {r.conditions.length > 0 && (
                <div className="orchestrator__conditions glass-card">
                    <h3 className="orchestrator__section-title">Conditions for Approval</h3>
                    <ol className="orchestrator__condition-list">
                        {r.conditions.map((c, i) => (
                            <li key={i} className="orchestrator__condition">{c}</li>
                        ))}
                    </ol>
                </div>
            )}

            {/* CAM Preview */}
            <div className="orchestrator__cam glass-card" id="cam-report">
                <div className="orchestrator__cam-header">
                    <h2 className="orchestrator__cam-title">Credit Appraisal Memo</h2>
                    <div className="orchestrator__cam-meta">
                        <span>Company: <strong>{companyProfile.name}</strong></span>
                        <span>Loan: <strong>{companyProfile.loanRequested}</strong></span>
                        <span>Date: <strong>{new Date().toLocaleDateString('en-IN')}</strong></span>
                    </div>
                </div>

                <div className="orchestrator__cam-section">
                    <h3>1. Company Overview</h3>
                    <p>{r.camSections.companyOverview}</p>
                </div>

                <div className="orchestrator__cam-section">
                    <h3>2. Financial Health Summary</h3>
                    <p>{r.camSections.financialSummary}</p>
                </div>

                <div className="orchestrator__cam-section">
                    <h3>3. Risk Assessment</h3>
                    <p>{r.camSections.riskAssessment}</p>
                </div>

                <div className="orchestrator__cam-section">
                    <h3>4. Loan Recommendation</h3>
                    <p>{r.camSections.loanRecommendation}</p>
                </div>
            </div>
        </div>
    );
}
