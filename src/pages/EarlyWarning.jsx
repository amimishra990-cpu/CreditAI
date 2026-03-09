import { useState } from 'react';
import { ShieldAlert, Filter } from 'lucide-react';
import AlertCard from '../components/ui/AlertCard';
import { earlyWarningAlerts } from '../data/mockData';
import './EarlyWarning.css';

const filterOptions = ['All', 'High', 'Medium', 'Low'];
const typeFilters = ['All', 'Financial', 'Legal', 'Market', 'News'];

export default function EarlyWarning() {
    const [alerts, setAlerts] = useState(earlyWarningAlerts);
    const [sevFilter, setSevFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const handleAcknowledge = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    };

    const filtered = alerts.filter(a => {
        if (sevFilter !== 'All' && a.severity !== sevFilter.toLowerCase()) return false;
        if (typeFilter !== 'All' && a.type !== typeFilter) return false;
        return true;
    });

    const unacknowledged = alerts.filter(a => !a.acknowledged).length;

    return (
        <div className="early-warning page-enter">
            <div className="early-warning__header">
                <div>
                    <h1 className="early-warning__title">Early Warning System</h1>
                    <p className="early-warning__subtitle">Continuous risk monitoring and alert detection</p>
                </div>
                <div className="early-warning__summary">
                    <div className="early-warning__stat">
                        <ShieldAlert size={18} />
                        <span><strong>{unacknowledged}</strong> unacknowledged alerts</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="early-warning__filters">
                <div className="early-warning__filter-group">
                    <Filter size={14} />
                    <span className="early-warning__filter-label">Severity:</span>
                    {filterOptions.map(f => (
                        <button
                            key={f}
                            className={`early-warning__filter-btn ${sevFilter === f ? 'early-warning__filter-btn--active' : ''}`}
                            onClick={() => setSevFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="early-warning__filter-group">
                    <span className="early-warning__filter-label">Type:</span>
                    {typeFilters.map(f => (
                        <button
                            key={f}
                            className={`early-warning__filter-btn ${typeFilter === f ? 'early-warning__filter-btn--active' : ''}`}
                            onClick={() => setTypeFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alert Feed */}
            <div className="early-warning__feed">
                {filtered.length === 0 ? (
                    <div className="early-warning__empty glass-card">
                        <ShieldAlert size={32} />
                        <p>No alerts match your filters</p>
                    </div>
                ) : (
                    filtered.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                    ))
                )}
            </div>
        </div>
    );
}
