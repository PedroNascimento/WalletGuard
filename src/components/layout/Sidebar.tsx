import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Landmark,
    PieChart,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed }) => {
    const { signOut } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: TrendingUp, label: 'Receitas', to: '/receitas' },
        { icon: TrendingDown, label: 'Despesas', to: '/despesas' },
        { icon: CreditCard, label: 'Cartões', to: '/cartoes' },
        { icon: Landmark, label: 'Bancos', to: '/bancos' },
        { icon: PieChart, label: 'Relatórios', to: '/relatorios' },
        { icon: Settings, label: 'Configurações', to: '/configuracoes' },
    ];

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden",
                    // Mobile behavior
                    "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    // Desktop behavior
                    "lg:translate-x-0 lg:static lg:h-screen",
                    isCollapsed ? "lg:w-0 lg:border-none" : "lg:w-64"
                )}
            >
                <div className="flex h-full flex-col w-64">
                    {/* Brand */}
                    <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-heading font-bold text-primary-700 dark:text-primary-300">
                                WalletGuard
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => window.innerWidth < 1024 && onClose()}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon size={20} className="shrink-0" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:text-red-400"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};
