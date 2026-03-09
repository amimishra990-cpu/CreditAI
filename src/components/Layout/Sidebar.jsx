import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    Settings,
    Bell,
    BarChart3,
    Clock,
    ChevronLeft,
    ChevronRight,
    Shield,
    User,
} from 'lucide-react';
import { useContext } from 'react';
import { LayoutContext } from './AppLayout';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/data-ingestion', icon: History, label: 'Report History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/early-warning', icon: Bell, label: 'Notifications' },
    { path: '/orchestrator', icon: BarChart3, label: 'Summary' },
    { path: '/agent-analysis', icon: Clock, label: 'Quick History' },
];

export default function Sidebar() {
    const { sidebarCollapsed, setSidebarCollapsed, setMobileMenuOpen, mobileMenuOpen } = useContext(LayoutContext);
    const location = useLocation();

    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''} ${mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">
                        <Shield size={20} />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="sidebar__logo-text">
                            <span className="sidebar__logo-title">CredixRay</span>
                        </div>
                    )}
                </div>
                <button
                    className="sidebar__toggle"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="sidebar__nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                        }
                        end={item.path === '/'}
                    >
                        <div className="sidebar__link-icon">
                            <item.icon size={18} />
                        </div>
                        {!sidebarCollapsed && <span className="sidebar__link-label">{item.label}</span>}
                        {location.pathname === item.path && <div className="sidebar__link-indicator" />}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__footer">
                {!sidebarCollapsed && (
                    <div className="sidebar__user-profile">
                        <div className="sidebar__user-avatar">
                            <User size={16} />
                        </div>
                        <div className="sidebar__user-details">
                            <span className="sidebar__user-name-footer">John Doe</span>
                            <span className="sidebar__user-role-footer">Admin</span>
                        </div>
                        <ChevronLeft size={14} className="sidebar__user-chevron" />
                    </div>
                )}
            </div>
        </aside>
    );
}
