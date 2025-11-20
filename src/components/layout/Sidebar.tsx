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
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">W</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">WalletGuard</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
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
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="border-t border-gray-100 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
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
