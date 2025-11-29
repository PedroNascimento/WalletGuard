import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    indicatorClassName?: string;
}

export function Progress({
    value = 0,
    max = 100,
    className,
    indicatorClassName,
    ...props
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "h-full w-full flex-1 bg-primary-600 transition-all",
                    indicatorClassName
                )}
                style={{ transform: `translateX(-${100 - percentage}%)` }}
            />
        </div>
    );
}
