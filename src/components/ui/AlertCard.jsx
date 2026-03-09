import './AlertCard.css';
import { AlertTriangle, Info, TrendingDown, Gavel, Newspaper, CheckCircle } from 'lucide-react';

const iconMap = {
    Financial: TrendingDown,
    Legal: Gavel,
    Market: Info,
    News: Newspaper,
};

const severityColors = {
    low: 'green',
    medium: 'gold',
    high: 'red',
};

export default function AlertCard({ alert, onAcknowledge }) {
    const Icon = iconMap[alert.type] || AlertTriangle;
    const sevColor = severityColors[alert.severity] || 'gray';

    return (
        <div className={`alert-card glass-card alert-card--${sevColor} ${alert.acknowledged ? 'alert-card--ack' : ''}`}>
            <div className="alert-card__icon-wrap">
                <Icon size={20} />
            </div>
            <div className="alert-card__body">
                <div className="alert-card__header">
                    <h4 className="alert-card__title">{alert.title}</h4>
                    <span className={`alert-card__severity alert-card__severity--${sevColor}`}>
                        {alert.severity.toUpperCase()}
                    </span>
                </div>
                <p className="alert-card__desc">{alert.description}</p>
                <div className="alert-card__meta">
                    <span className="alert-card__company">{alert.company}</span>
                    <span className="alert-card__time">{alert.timestamp}</span>
                </div>
            </div>
            {!alert.acknowledged && onAcknowledge && (
                <button className="alert-card__action" onClick={() => onAcknowledge(alert.id)} title="Acknowledge">
                    <CheckCircle size={18} />
                </button>
            )}
        </div>
    );
}
