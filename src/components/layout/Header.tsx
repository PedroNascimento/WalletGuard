import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 lg:hidden">WalletGuard</h1>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                    JD
                </div>
            </div>
        </header>
    );
};
