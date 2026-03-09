import { useState } from 'react';
import { FileSearch, TrendingUp, Globe, UserCheck, CheckCircle, Clock, Loader } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatusBadge from '../components/ui/StatusBadge';
import {
    documentAnalysis,
    financialAnalysis,
    researchAnalysis,
    promoterAnalysis,
    agentStatuses,
} from '../data/mockData';
import './AgentAnalysis.css';

const agents = [
    { key: 'document', label: 'Document Analysis', icon: FileSearch, color: '#3b82f6' },
    { key: 'financial', label: 'Financial Analysis', icon: TrendingUp, color: '#10b981' },
    { key: 'research', label: 'Research Agent', icon: Globe, color: '#8b5cf6' },
    { key: 'promoter', label: 'Promoter Analysis', icon: UserCheck, color: '#f59e0b' },
];

const statusKeys = {
    document: 'documentAgent',
    financial: 'financialAgent',
    research: 'researchAgent',
    promoter: 'promoterAgent',
};

export default function AgentAnalysis() {
    const [activeAgent, setActiveAgent] = useState('document');

    return (
        <div className="agent-analysis page-enter">
            <div className="agent-analysis__header">
                <h1 className="agent-analysis__title">AI Agent Analysis</h1>
                <p className="agent-analysis__subtitle">Independent AI tools analyze different aspects of the company</p>
            </div>

            {/* Agent selector tabs */}
            <div className="agent-analysis__tabs">
                {agents.map((a) => {
                    const st = agentStatuses[statusKeys[a.key]];
                    return (
                        <button
                            key={a.key}
                            className={`agent-analysis__tab ${activeAgent === a.key ? 'agent-analysis__tab--active' : ''}`}
                            onClick={() => setActiveAgent(a.key)}
                            style={{ '--tab-color': a.color }}
                        >
                            <a.icon size={18} />
                            <span>{a.label}</span>
                            <StatusBadge status={st.status} />
                        </button>
                    );
                })}
            </div>

            {/* Agent content */}
            <div className="agent-analysis__content glass-card" key={activeAgent}>
                {activeAgent === 'document' && <DocumentPanel />}
                {activeAgent === 'financial' && <FinancialPanel />}
                {activeAgent === 'research' && <ResearchPanel />}
                {activeAgent === 'promoter' && <PromoterPanel />}
            </div>
        </div>
    );
}

function DocumentPanel() {
    const data = documentAnalysis;
    return (
        <div className="agent-panel animate-fade-in">
            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Extracted Entities</h3>
                <div className="agent-panel__entities">
                    {data.extractedEntities.map((e, i) => (
                        <div className="agent-panel__entity" key={i}>
                            <span className="agent-panel__entity-label">{e.entity}</span>
                            <span className="agent-panel__entity-value">{e.value}</span>
                            <div className="agent-panel__confidence-bar">
                                <div
                                    className="agent-panel__confidence-fill"
                                    style={{ width: `${e.confidence * 100}%` }}
                                />
                            </div>
                            <span className="agent-panel__confidence-text">{(e.confidence * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Key Findings</h3>
                <ul className="agent-panel__findings">
                    {data.keyFindings.map((f, i) => (
                        <li key={i} className="agent-panel__finding">
                            <CheckCircle size={16} className="agent-panel__finding-icon" />
                            <span>{f}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function FinancialPanel() {
    const data = financialAnalysis;
    return (
        <div className="agent-panel animate-fade-in">
            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Revenue & Profit Trend</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                fontSize: '13px',
                            }}
                        />
                        <Line type="monotone" dataKey="revenue" name="Revenue (₹Cr)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                        <Line type="monotone" dataKey="profit" name="Net Profit (₹Cr)" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Financial Ratios</h3>
                <div className="agent-panel__ratios">
                    {data.ratios.map((r, i) => (
                        <div className="agent-panel__ratio-card" key={i}>
                            <span className="agent-panel__ratio-name">{r.name}</span>
                            <span className={`agent-panel__ratio-value agent-panel__ratio-value--${r.status}`}>
                                {typeof r.value === 'number' && r.value < 1 ? (r.value * 100).toFixed(1) + '%' : r.value}
                            </span>
                            <span className="agent-panel__ratio-benchmark">Benchmark: {typeof r.benchmark === 'number' && r.benchmark < 1 ? (r.benchmark * 100).toFixed(1) + '%' : r.benchmark}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="agent-panel__section-row">
                <div className="agent-panel__info-box">
                    <h4>GST Compliance</h4>
                    <div className="agent-panel__info-items">
                        <div className="agent-panel__info-item"><span>Filing Regularity</span><strong>{data.gstCompliance.filingRegularity}</strong></div>
                        <div className="agent-panel__info-item"><span>Avg Monthly Turnover</span><strong>{data.gstCompliance.averageMonthlyTurnover}</strong></div>
                        <div className="agent-panel__info-item"><span>Payment Timeliness</span><strong>{data.gstCompliance.gstPaymentTimeliness}</strong></div>
                    </div>
                </div>
                <div className="agent-panel__info-box">
                    <h4>Bank Statement Highlights</h4>
                    <div className="agent-panel__info-items">
                        <div className="agent-panel__info-item"><span>Avg Monthly Balance</span><strong>{data.bankStatementHighlights.avgMonthlyBalance}</strong></div>
                        <div className="agent-panel__info-item"><span>Cheque Bounces</span><strong>{data.bankStatementHighlights.chequeBouncesPercent}</strong></div>
                        <div className="agent-panel__info-item"><span>EMI Regularity</span><strong>{data.bankStatementHighlights.emiRegularity}</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResearchPanel() {
    const data = researchAnalysis;
    return (
        <div className="agent-panel animate-fade-in">
            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">News Sentiment (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.newsSentiment}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                fontSize: '13px',
                            }}
                        />
                        <Bar dataKey="positive" name="Positive" fill="#10b981" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="neutral" name="Neutral" fill="#64748b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="negative" name="Negative" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Key News Articles</h3>
                <div className="agent-panel__news-list">
                    {data.keyNews.map((n, i) => (
                        <div className="agent-panel__news-item" key={i}>
                            <div className={`agent-panel__news-dot agent-panel__news-dot--${n.sentiment}`} />
                            <div className="agent-panel__news-body">
                                <span className="agent-panel__news-title">{n.title}</span>
                                <span className="agent-panel__news-meta">{n.source} · {n.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="agent-panel__section-row">
                <div className="agent-panel__info-box">
                    <h4>Industry Outlook</h4>
                    <p className="agent-panel__outlook-text">{data.industryOutlook}</p>
                </div>
                <div className="agent-panel__info-box">
                    <h4>Litigation Flags</h4>
                    <div className="agent-panel__info-items">
                        {data.litigationFlags.map((l, i) => (
                            <div className="agent-panel__info-item" key={i}>
                                <span>{l.case} ({l.year})</span>
                                <StatusBadge status={l.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PromoterPanel() {
    const data = promoterAnalysis;
    return (
        <div className="agent-panel animate-fade-in">
            <div className="agent-panel__section">
                <h3 className="agent-panel__section-title">Promoter / Director Profiles</h3>
                <div className="agent-panel__promoters">
                    {data.promoters.map((p, i) => (
                        <div className="agent-panel__promoter-card" key={i}>
                            <div className="agent-panel__promoter-header">
                                <div className="agent-panel__promoter-avatar" style={{ background: `hsl(${i * 120}, 60%, 50%)` }}>
                                    {p.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="agent-panel__promoter-name">{p.name}</h4>
                                    <span className="agent-panel__promoter-role">{p.role}</span>
                                </div>
                            </div>
                            <div className="agent-panel__promoter-details">
                                <div className="agent-panel__promoter-stat">
                                    <span>DIN</span><strong>{p.din}</strong>
                                </div>
                                <div className="agent-panel__promoter-stat">
                                    <span>Experience</span><strong>{p.experience}</strong>
                                </div>
                                <div className="agent-panel__promoter-stat">
                                    <span>CIBIL Score</span>
                                    <strong className={p.cibilScore > 750 ? 'text-green' : 'text-gold'}>{p.cibilScore}</strong>
                                </div>
                                <div className="agent-panel__promoter-stat">
                                    <span>Other Directorships</span><strong>{p.otherDirectorships}</strong>
                                </div>
                            </div>
                            <p className="agent-panel__promoter-bio">{p.background}</p>
                            {p.riskFlags.length > 0 && (
                                <div className="agent-panel__promoter-flags">
                                    {p.riskFlags.map((f, fi) => (
                                        <span key={fi} className="agent-panel__promoter-flag">{f}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="agent-panel__section">
                <div className="agent-panel__promoter-summary">
                    <span>Overall Promoter Risk Assessment:</span>
                    <StatusBadge status={data.overallPromoterRisk} />
                </div>
            </div>
        </div>
    );
}
