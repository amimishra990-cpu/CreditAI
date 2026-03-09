import { Outlet } from 'react-router-dom';
import { useState, createContext } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './AppLayout.css';

export const LayoutContext = createContext();

export default function AppLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <LayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen }}>
            <div className={`app-layout ${sidebarCollapsed ? 'app-layout--collapsed' : ''} ${mobileMenuOpen ? 'app-layout--mobile-open' : ''}`}>
                {/* Mobile overlay */}
                {mobileMenuOpen && <div className="app-layout__overlay" onClick={() => setMobileMenuOpen(false)} />}
                <Sidebar />
                <div className="app-layout__main">
                    <TopBar />
                    <main className="app-layout__content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
}
