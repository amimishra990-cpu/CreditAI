import { useEffect, useState, useRef } from 'react';
import './MetricCard.css';

export default function MetricCard({ label, value, trend, icon: Icon, color = 'blue', delay = 0 }) {
    const [displayValue, setDisplayValue] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!visible) return;
        const target = typeof value === 'number' ? value : parseInt(value, 10);
        if (isNaN(target)) { setDisplayValue(value); return; }
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, [visible, value]);

    const colorMap = {
        blue: { bg: 'var(--color-info-bg)', accent: 'var(--color-accent-blue)' },
        green: { bg: 'var(--color-success-bg)', accent: 'var(--color-success)' },
        red: { bg: 'var(--color-danger-bg)', accent: 'var(--color-danger)' },
        gold: { bg: 'var(--color-warning-bg)', accent: 'var(--color-warning)' },
    };

    const c = colorMap[color] || colorMap.blue;

    return (
        <div
            ref={ref}
            className={`metric-card glass-card ${visible ? 'metric-card--visible' : ''}`}
            style={{ '--card-accent': c.accent, '--card-accent-bg': c.bg }}
        >
            <div className="metric-card__header">
                <span className="metric-card__label">{label}</span>
                {Icon && (
                    <div className="metric-card__icon">
                        <Icon size={20} />
                    </div>
                )}
            </div>
            <div className="metric-card__value">{displayValue}</div>
            {trend !== undefined && (
                <div className={`metric-card__trend ${trend >= 0 ? 'metric-card__trend--up' : 'metric-card__trend--down'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                </div>
            )}
        </div>
    );
}
