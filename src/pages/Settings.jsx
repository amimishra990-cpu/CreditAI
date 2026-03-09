import { useState } from 'react';
import { Bot, Activity, Gauge, Shield, Save } from 'lucide-react';
import './Settings.css';

const agentConfigs = [
    { key: 'doc', label: 'Document Analysis Agent', desc: 'Extracts entities from PDFs and financial statements', icon: Bot },
    { key: 'fin', label: 'Financial Analysis Agent', desc: 'Analyzes GST filings, bank statements, and ratios', icon: Activity },
    { key: 'res', label: 'Research Agent', desc: 'Searches news, industry trends, and litigation records', icon: Shield },
    { key: 'prm', label: 'Promoter Analysis Agent', desc: 'Evaluates promoter/director background and risk', icon: Gauge },
];

export default function Settings() {
    const [enabledAgents, setEnabledAgents] = useState({ doc: true, fin: true, res: true, prm: true });
    const [thresholds, setThresholds] = useState({
        riskScore: 50,
        confidenceMin: 70,
        alertSeverity: 'medium',
    });
    const [saved, setSaved] = useState(false);

    const toggleAgent = (key) => {
        setEnabledAgents({ ...enabledAgents, [key]: !enabledAgents[key] });
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="settings page-enter">
            <div className="settings__header">
                <h1 className="settings__title">Settings</h1>
                <p className="settings__subtitle">Configure AI agents, risk thresholds, and system preferences</p>
            </div>

            {/* Agent Toggles */}
            <div className="settings__section glass-card">
                <h3 className="settings__section-title">AI Agent Configuration</h3>
                <div className="settings__agents">
                    {agentConfigs.map((a) => (
                        <div className="settings__agent-row" key={a.key}>
                            <div className="settings__agent-icon">
                                <a.icon size={20} />
                            </div>
                            <div className="settings__agent-info">
                                <span className="settings__agent-label">{a.label}</span>
                                <span className="settings__agent-desc">{a.desc}</span>
                            </div>
                            <label className="settings__toggle">
                                <input
                                    type="checkbox"
                                    checked={enabledAgents[a.key]}
                                    onChange={() => toggleAgent(a.key)}
                                />
                                <span className="settings__toggle-slider" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk Thresholds */}
            <div className="settings__section glass-card">
                <h3 className="settings__section-title">Risk Thresholds</h3>
                <div className="settings__threshold">
                    <div className="settings__threshold-row">
                        <label>Risk Score Alert Threshold</label>
                        <div className="settings__slider-wrap">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={thresholds.riskScore}
                                onChange={(e) => setThresholds({ ...thresholds, riskScore: +e.target.value })}
                                className="settings__slider"
                            />
                            <span className="settings__slider-value">{thresholds.riskScore}</span>
                        </div>
                    </div>
                    <div className="settings__threshold-row">
                        <label>Minimum Confidence Score (%)</label>
                        <div className="settings__slider-wrap">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={thresholds.confidenceMin}
                                onChange={(e) => setThresholds({ ...thresholds, confidenceMin: +e.target.value })}
                                className="settings__slider"
                            />
                            <span className="settings__slider-value">{thresholds.confidenceMin}%</span>
                        </div>
                    </div>
                    <div className="settings__threshold-row">
                        <label>Alert Severity Minimum</label>
                        <select
                            value={thresholds.alertSeverity}
                            onChange={(e) => setThresholds({ ...thresholds, alertSeverity: e.target.value })}
                            className="settings__select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* API Status */}
            <div className="settings__section glass-card">
                <h3 className="settings__section-title">System Status</h3>
                <div className="settings__status-list">
                    <div className="settings__status-row">
                        <span>Document Extraction API</span>
                        <span className="settings__status-indicator settings__status-indicator--online">Connected</span>
                    </div>
                    <div className="settings__status-row">
                        <span>Financial Analysis Engine</span>
                        <span className="settings__status-indicator settings__status-indicator--online">Connected</span>
                    </div>
                    <div className="settings__status-row">
                        <span>Research Agent API</span>
                        <span className="settings__status-indicator settings__status-indicator--online">Connected</span>
                    </div>
                    <div className="settings__status-row">
                        <span>Orchestrator Service</span>
                        <span className="settings__status-indicator settings__status-indicator--online">Connected</span>
                    </div>
                    <div className="settings__status-row">
                        <span>Early Warning Module</span>
                        <span className="settings__status-indicator settings__status-indicator--online">Connected</span>
                    </div>
                </div>
            </div>

            <button className={`settings__save-btn ${saved ? 'settings__save-btn--saved' : ''}`} onClick={handleSave}>
                <Save size={16} />
                {saved ? 'Settings Saved!' : 'Save Settings'}
            </button>
        </div>
    );
}
