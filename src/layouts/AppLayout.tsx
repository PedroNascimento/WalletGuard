import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const AppLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
