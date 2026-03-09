import { useContext, useState, useRef, useEffect } from 'react';
import { Bell, Search, Settings, Menu, X, Play } from 'lucide-react';
import { LayoutContext } from './AppLayout';
import { companyList } from '../../data/mockData';
import './TopBar.css';

const notifications = [
    { id: 1, text: 'Rajesh Mehta under investigation for bid-rigging', time: '2m ago', read: false },
    { id: 2, text: 'TechnoSteel — CAM report ready for review', time: '15m ago', read: false },
    { id: 3, text: 'GST-Cashflow mismatch flagged for Q2', time: '1h ago', read: false },
];

export default function TopBar({ selectedCompany, onCompanyChange }) {
    const { mobileMenuOpen, setMobileMenuOpen } = useContext(LayoutContext);

    // Notifications
    const [notiOpen, setNotiOpen] = useState(false);
    const [notiList, setNotiList] = useState(notifications);
    const notiRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (notiRef.current && !notiRef.current.contains(e.target)) setNotiOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notiList.filter(n => !n.read).length;
    const markRead = (id) => setNotiList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotiList(prev => prev.map(n => ({ ...n, read: true })));

    const companyName = selectedCompany?.name || 'TechnoSteel Pvt. Ltd.';
    const shortName = companyName.length > 18 ? companyName.substring(0, 18) + '…' : companyName;

    return (
        <header className="topbar">
            {/* Mobile hamburger */}
            <button className="topbar__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Welcome */}
            <div className="topbar__welcome">
                <span className="topbar__welcome-text">Welcome, John!</span>
                <span className="topbar__welcome-divider">|</span>
                <span className="topbar__welcome-company">{shortName}</span>
            </div>

            {/* Right */}
            <div className="topbar__right">
                <button className="topbar__icon-btn" aria-label="Search">
                    <Search size={18} />
                </button>

                {/* Notifications */}
                <div ref={notiRef} style={{ position: 'relative' }}>
                    <button className="topbar__icon-btn" aria-label="Notifications" onClick={() => setNotiOpen(!notiOpen)}>
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="topbar__notification-badge">{unreadCount}</span>}
                    </button>
                    {notiOpen && (
                        <div className="topbar__noti-dropdown">
                            <div className="topbar__noti-header">
                                <span>Notifications</span>
                                {unreadCount > 0 && <button className="topbar__noti-mark-all" onClick={markAllRead}>Mark all read</button>}
                            </div>
                            {notiList.map(n => (
                                <div key={n.id} className={`topbar__noti-item ${!n.read ? 'topbar__noti-item--unread' : ''}`} onClick={() => markRead(n.id)}>
                                    <div className={`topbar__noti-dot ${!n.read ? 'topbar__noti-dot--unread' : ''}`} />
                                    <div className="topbar__noti-body">
                                        <span className="topbar__noti-text">{n.text}</span>
                                        <span className="topbar__noti-time">{n.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="topbar__icon-btn" aria-label="Settings">
                    <Settings size={18} />
                </button>

                <button className="topbar__run-btn">
                    <Play size={14} />
                    <span>Run Analysis</span>
                </button>
            </div>
        </header>
    );
}
