import React from 'react';
import { cn } from '../../utils/cn';

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
}

export function Table<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    isLoading
}: TableProps<T>) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;
    }

    if (data.length === 0) {
        return <div className="p-8 text-center text-gray-500">Nenhum registro encontrado.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={cn("px-4 py-3", col.className)}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onRowClick?.(item)}
                            className={cn(
                                "transition-colors hover:bg-gray-50",
                                onRowClick && "cursor-pointer"
                            )}
                        >
                            {columns.map((col, index) => (
                                <td key={index} className={cn("px-4 py-3", col.className)}>
                                    {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
