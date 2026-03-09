import './StatusBadge.css';

const statusConfig = {
    'analyzed': { color: 'green', label: 'Analyzed' },
    'processing': { color: 'blue', label: 'Processing' },
    'queued': { color: 'gray', label: 'Queued' },
    'error': { color: 'red', label: 'Error' },
    'Approved': { color: 'green', label: 'Approved' },
    'Under Review': { color: 'blue', label: 'Under Review' },
    'Risk Flagged': { color: 'red', label: 'Risk Flagged' },
    'Pending Docs': { color: 'gold', label: 'Pending Docs' },
    'complete': { color: 'green', label: 'Complete' },
    'idle': { color: 'gray', label: 'Idle' },
    'analyzing': { color: 'blue', label: 'Analyzing' },
    'Resolved': { color: 'green', label: 'Resolved' },
    'Pending': { color: 'gold', label: 'Pending' },
    'Low': { color: 'green', label: 'Low' },
    'Medium': { color: 'gold', label: 'Medium' },
    'High': { color: 'red', label: 'High' },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || { color: 'gray', label: status };
    return (
        <span className={`status-badge status-badge--${config.color}`}>
            <span className="status-badge__dot" />
            {config.label}
        </span>
    );
}
