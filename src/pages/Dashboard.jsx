import { useState } from 'react';
import {
    Building2, TrendingUp, TrendingDown, AlertTriangle,
    ChevronDown, ArrowRight, ArrowUp, ArrowDown,
    CheckCircle, XCircle, AlertCircle, ExternalLink,
    FileSearch, BarChart3, Search as SearchIcon, Shield,
    User, Minus
} from 'lucide-react';
import RiskGauge from '../components/ui/RiskGauge';
import { companies, companyList } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
    const [activeCompanyId, setActiveCompanyId] = useState('technosteel');
    const [companySelectorOpen, setCompanySelectorOpen] = useState(false);
    const [riskTimeRange, setRiskTimeRange] = useState('1Y');

    const company = companies[activeCompanyId];

    const handleCompanyChange = (id) => {
        setActiveCompanyId(id);
        setCompanySelectorOpen(false);
    };

    return (
        <div className="dash page-enter">
            {/* Company Selector */}
            <div className="dash__company-select-bar">
                <span className="dash__company-select-label">Company Solution</span>
                <ChevronDown size={14} />
            </div>

            <div className="dash__grid">
                {/* ======== MAIN AREA ======== */}
                <div className="dash__main">

                    {/* ── Row 1: Company Overview + Promoter Network ── */}
                    <div className="dash__row-1">
                        {/* Company Overview */}
                        <div className="dash__company-card card">
                            <h3 className="card__title">Company Overview</h3>
                            <div className="dash__company-badge-row">
                                <Building2 size={14} />
                                <span className="dash__company-badge-text">Biancorealestate.co</span>
                            </div>

                            {/* Company Name Selector */}
                            <div className="dash__company-name-selector" onClick={() => setCompanySelectorOpen(!companySelectorOpen)}>
                                <Building2 size={15} />
                                <span>{company.name}</span>
                                <ChevronDown size={14} className={companySelectorOpen ? 'rotated' : ''} />
                            </div>
                            {companySelectorOpen && (
                                <div className="dash__company-dropdown">
                                    {companyList.map((c) => (
                                        <button
                                            key={c.id}
                                            className={`dash__company-option ${c.id === activeCompanyId ? 'dash__company-option--active' : ''}`}
                                            onClick={() => handleCompanyChange(c.id)}
                                        >
                                            <Building2 size={14} />
                                            <span>{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="dash__company-body">
                                <div className="dash__company-gauge">
                                    <RiskGauge score={company.riskScore} size={140} label="" />
                                    <span className="dash__gauge-label">{company.riskLevel}</span>
                                </div>
                                <div className="dash__company-details">
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Revenue:</span>
                                        <span className="dash__detail-val">{company.revenue}</span>
                                    </div>
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Profit Margin:</span>
                                        <span className="dash__detail-val">{company.profitMargin}</span>
                                    </div>
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Loan Limit:</span>
                                        <span className="dash__detail-val">{company.loanLimit}</span>
                                    </div>
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Recommended Interest:</span>
                                        <span className="dash__detail-val">{company.recommendedInterest}</span>
                                    </div>
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Cash Flow Status:</span>
                                        <span className={`dash__detail-val ${company.cashFlowStatus === 'Positive' ? 'text-green' : 'text-red'}`}>
                                            {company.cashFlowStatus}
                                            {company.cashFlowStatus === 'Positive' ?
                                                <CheckCircle size={12} style={{ marginLeft: 4 }} /> :
                                                <XCircle size={12} style={{ marginLeft: 4 }} />
                                            }
                                        </span>
                                    </div>
                                    <div className="dash__detail-row">
                                        <span className="dash__detail-key">Litigation Alerts:</span>
                                        <span className={`dash__detail-val ${company.litigationAlerts > 0 ? 'text-orange' : 'text-green'}`}>
                                            {company.litigationAlerts}
                                            {company.litigationAlerts > 0 && <AlertCircle size={12} style={{ marginLeft: 4 }} />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promoter Network */}
                        <div className="dash__promoter-network card">
                            <div className="dash__network-center">
                                <div className="dash__promoter-photo">
                                    <User size={40} />
                                </div>
                                <span className="dash__promoter-name-main">{company.promoter.name}</span>
                            </div>
                            <div className="dash__network-nodes">
                                {company.promoter.connectedEntities.map((entity, i) => (
                                    <div className={`dash__network-node dash__network-node--${entity.type}`} key={i}>
                                        <div className="dash__network-node-icon">
                                            {entity.type === 'holding' ? <Building2 size={14} /> :
                                                entity.type === 'related' ? <Building2 size={14} /> :
                                                    entity.type === 'gst' ? <FileSearch size={14} /> :
                                                        <AlertTriangle size={14} />}
                                        </div>
                                        <span className="dash__network-node-name">{entity.name}</span>
                                        <span className="dash__network-node-rel">{entity.relation}</span>
                                        <div className="dash__network-line" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── News & Alerts ── */}
                    <div className="dash__news-bar card">
                        <h3 className="card__title">News & Alerts</h3>
                        <div className="dash__news-list">
                            {company.newsAlerts.map((n, i) => (
                                <div className="dash__news-item" key={i}>
                                    <span className="dash__news-icon">{n.icon}</span>
                                    <span className="dash__news-text-main">{n.text}</span>
                                    {n.source && <span className="dash__news-attr">▲ {n.source}</span>}
                                    {n.date && <span className="dash__news-date">{n.date}</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Row 2: Financial Analysis + Risk Factors ── */}
                    <div className="dash__row-2">
                        {/* Financial Analysis */}
                        <div className="dash__financial card">
                            <h3 className="card__title">Financial Analysis</h3>
                            <div className="dash__fin-table-wrap">
                                <table className="dash__fin-table">
                                    <thead>
                                        <tr>
                                            <th>Quarter</th>
                                            <th>GST Invoices</th>
                                            <th>Bank Inflow</th>
                                            <th>Anomalies</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {company.financialQuarters.map((q, i) => (
                                            <tr key={i}>
                                                <td className="dash__fin-metric">{q.quarter}</td>
                                                <td>{q.gstInvoices}</td>
                                                <td>{q.bankInflow}</td>
                                                <td>
                                                    {q.anomalies === 'arrow-right' && <ArrowRight size={14} className="text-blue" />}
                                                    {q.anomalies === 'arrow-up' && <ArrowUp size={14} className="text-red" />}
                                                    {q.anomalies === 'down' && <ArrowDown size={14} className="text-red" />}
                                                    {q.anomalies === 'stable' && <Minus size={14} className="text-green" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="dash__fin-links">
                                <a href="#" className="dash__fin-link">View Full Analysis</a>
                                <a href="#" className="dash__fin-link">View Full Analysis</a>
                            </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="dash__risk-factors card">
                            <div className="dash__rf-header">
                                <h3 className="card__title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Risk Factors</h3>
                                <div className="dash__rf-time-btns">
                                    {['1Y', '2Y', '3Y'].map(t => (
                                        <button
                                            key={t}
                                            className={`dash__rf-time-btn ${riskTimeRange === t ? 'dash__rf-time-btn--active' : ''}`}
                                            onClick={() => setRiskTimeRange(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="dash__rf-list">
                                {company.riskFactors.map((rf, i) => (
                                    <div className="dash__rf-item" key={i}>
                                        <div className="dash__rf-left">
                                            <AlertTriangle size={14} className={rf.severity === 'high' ? 'text-red' : rf.severity === 'medium' ? 'text-orange' : 'text-blue'} />
                                            <span className="dash__rf-name">{rf.name}</span>
                                        </div>
                                        <p className="dash__rf-detail">{rf.detail}</p>
                                        {/* Mini chart placeholder */}
                                        <div className="dash__rf-minichart">
                                            <div className="dash__rf-bar" style={{ height: '60%' }} />
                                            <div className="dash__rf-bar" style={{ height: '80%' }} />
                                            <div className="dash__rf-bar" style={{ height: '45%' }} />
                                            <div className="dash__rf-bar" style={{ height: '90%' }} />
                                            <div className="dash__rf-bar" style={{ height: '70%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Row 3: Early Warning + Risk Summary Bottom ── */}
                    <div className="dash__row-3">
                        {/* Early Warning Risk Detection */}
                        <div className="dash__ew-card card">
                            <h3 className="card__title">Early Warning Risk Detection</h3>
                            <div className="dash__ew-agents">
                                {Object.entries(company.earlyWarning).map(([key, val]) => (
                                    <div className="dash__ew-agent" key={key}>
                                        {val ? <CheckCircle size={14} className="text-green" /> : <XCircle size={14} className="text-red" />}
                                        <span className="dash__ew-agent-label">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace('Alt', '')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk Summary Bottom */}
                        <div className="dash__risk-summary-bottom card">
                            <div className="dash__rsb-header">
                                <h3 className="card__title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Risk Summary</h3>
                                <div className="dash__rsb-toggle">
                                    <span>To See</span>
                                    <ChevronDown size={12} />
                                </div>
                            </div>
                            <div className="dash__rsb-body">
                                <div className="dash__rsb-score-box">
                                    <span className="dash__rsb-score">{company.riskSummary.score}</span>
                                </div>
                                <div className="dash__rsb-info">
                                    <span className={`dash__rsb-level ${company.riskSummary.score > 60 ? 'text-orange' : company.riskSummary.score > 40 ? 'text-blue' : 'text-green'}`}>{company.riskSummary.level}</span>
                                    <span className="dash__rsb-decision">Loan Decision: {company.riskSummary.decision}</span>
                                    <span className="dash__rsb-loan">{company.riskSummary.loanDetails}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ======== RIGHT SIDEBAR ======== */}
                <div className="dash__sidebar-right">
                    {/* Promoter Risk Insights */}
                    <div className="dash__pri-card card">
                        <h3 className="card__title">Promoter Risk Insights</h3>
                        <div className="dash__pri-score-row">
                            <RiskGauge score={company.promoterRisk.score} size={90} label="" />
                            <div className="dash__pri-score-info">
                                <span className={`dash__pri-level ${company.promoterRisk.score > 60 ? 'text-red' : 'text-green'}`}>
                                    {company.promoterRisk.level}
                                </span>
                            </div>
                        </div>
                        <div className="dash__pri-details">
                            <div className="dash__pri-row">
                                <span className="dash__pri-key">Litigation History</span>
                                <span className="dash__pri-val">{company.promoterRisk.litigationHistory}</span>
                            </div>
                            <div className="dash__pri-row">
                                <span className="dash__pri-key">Negative News</span>
                                <span className="dash__pri-val">{company.promoterRisk.negativeNews}</span>
                            </div>
                            <div className="dash__pri-row">
                                <span className="dash__pri-key">Related Companies</span>
                                <span className="dash__pri-val">{company.promoterRisk.relatedCompanies}</span>
                            </div>
                            <div className="dash__pri-row">
                                <span className="dash__pri-key">Fraud Probability</span>
                                <span className={`dash__pri-val ${company.promoterRisk.fraudProbability.includes('95') || company.promoterRisk.fraudProbability.includes('78') ? 'text-red' : 'text-green'}`}>
                                    {company.promoterRisk.fraudProbability}
                                </span>
                            </div>
                            <div className="dash__pri-row">
                                <span className="dash__pri-key">Promoter Reputation</span>
                                <span className={`dash__pri-val ${company.promoterRisk.promoterReputation === 'Negative' ? 'text-red' : 'text-green'}`}>
                                    {company.promoterRisk.promoterReputation === 'Negative' ? '✕ ' : '✓ '}
                                    {company.promoterRisk.promoterReputation}
                                </span>
                            </div>
                        </div>
                        <button className="dash__pri-report-btn">View Promoter Report</button>
                    </div>

                    {/* Risk Summary */}
                    <div className="dash__risk-summary card">
                        <h3 className="card__title">Risk Summary</h3>
                        <div className="dash__rs-top">
                            <div className="dash__rs-score-box">
                                <span className="dash__rs-score">{company.riskSummary.score}</span>
                            </div>
                            <div>
                                <span className={`dash__rs-level ${company.riskSummary.score > 60 ? 'text-orange' : company.riskSummary.score > 40 ? 'text-blue' : 'text-green'}`}>{company.riskSummary.level}</span>
                                <span className="dash__rs-decision">Loan Decision: {company.riskSummary.decision}</span>
                                <span className="dash__rs-loan">{company.riskSummary.loanDetails}</span>
                            </div>
                        </div>

                        <div className="dash__rs-reasons">
                            <span className="dash__rs-reasons-title">Reasons:</span>
                            <ul className="dash__rs-reasons-list">
                                {company.riskSummary.reasons.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="dash__rs-agents">
                            {company.agentConfidence.map((a, i) => (
                                <div className="dash__rs-agent-row" key={i}>
                                    {a.confidence > 0.7 ? <CheckCircle size={12} className="text-green" /> : <XCircle size={12} className="text-red" />}
                                    <span className="dash__rs-agent-name">{a.agent}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
