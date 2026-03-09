import { useEffect, useState } from 'react';
import './RiskGauge.css';

export default function RiskGauge({ score = 0, size = 180, label = 'Risk Score' }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 300);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 70;
    const circumference = Math.PI * radius; // half circle
    const offset = circumference - (animatedScore / 100) * circumference;

    const getColor = (s) => {
        if (s <= 25) return '#10b981';
        if (s <= 50) return '#f59e0b';
        if (s <= 75) return '#f97316';
        return '#ef4444';
    };

    const getRiskLabel = (s) => {
        if (s <= 25) return 'Low Risk';
        if (s <= 50) return 'Medium-Low';
        if (s <= 75) return 'Medium-High';
        return 'High Risk';
    };

    const color = getColor(animatedScore);

    return (
        <div className="risk-gauge" style={{ width: size }}>
            <svg viewBox="0 0 160 100" className="risk-gauge__svg">
                {/* bg arc */}
                <path
                    d="M 10 90 A 70 70 0 0 1 150 90"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                {/* value arc */}
                <path
                    d="M 10 90 A 70 70 0 0 1 150 90"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
                        filter: `drop-shadow(0 0 6px ${color}50)`,
                    }}
                />
                {/* center text */}
                <text x="80" y="72" textAnchor="middle" className="risk-gauge__score" fill={color}>
                    {animatedScore}
                </text>
                <text x="80" y="88" textAnchor="middle" className="risk-gauge__label" fill="var(--color-text-muted)">
                    {getRiskLabel(animatedScore)}
                </text>
            </svg>
            <div className="risk-gauge__bottom-label">{label}</div>
        </div>
    );
}
