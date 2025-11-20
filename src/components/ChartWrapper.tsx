import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '../utils/cn';

interface ChartWrapperProps {
    children: React.ReactElement;
    height?: number | string;
    className?: string;
    title?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
    children,
    height = 300,
    className,
    title,
}) => {
    return (
        <div className={cn("w-full", className)}>
            {title && <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer>
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
