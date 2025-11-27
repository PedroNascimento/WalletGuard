import React from "react";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  onMenuClick: () => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  toggleSidebar,
  isSidebarCollapsed,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 px-4 backdrop-blur-md lg:px-8 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 -ml-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          title={isSidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={24} />
          ) : (
            <PanelLeftClose size={24} />
          )}
        </button>

        <h1 className="text-xl font-semibold text-gray-900 dark:text-white lg:hidden">
          WalletGuard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          title={theme === "light" ? "Modo escuro" : "Modo claro"}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <Bell size={20} />
        </Button>

        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium text-sm">
          JD
        </div>
      </div>
    </header>
  );
};
