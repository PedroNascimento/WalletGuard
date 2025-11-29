import { useState } from 'react';
import type { ImportedTransaction } from '../../types/import';
import { CATEGORIAS_DESPESA } from '../../types/despesa';
import { CATEGORIAS_RECEITA } from '../../types/receita';
import { formatCurrency } from '../../utils/financial';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

interface TransactionPreviewProps {
    transactions: ImportedTransaction[];
    onUpdate: (transactions: ImportedTransaction[]) => void;
    onSave: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function TransactionPreview({ transactions, onUpdate, onSave, onCancel, isLoading }: TransactionPreviewProps) {
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const handleToggleSelect = (id: string) => {
        const updated = transactions.map(t =>
            t.id === id ? { ...t, selected: !t.selected } : t
        );
        onUpdate(updated);
    };

    const handleToggleAll = () => {
        const allSelected = transactions.every(t => t.selected);
        const updated = transactions.map(t => ({ ...t, selected: !allSelected }));
        onUpdate(updated);
    };

    const handleChangeCategory = (id: string, category: string) => {
        const updated = transactions.map(t =>
            t.id === id ? { ...t, category } : t
        );
        onUpdate(updated);
    };

    const handleChangeDescription = (id: string, description: string) => {
        const updated = transactions.map(t =>
            t.id === id ? { ...t, description } : t
        );
        onUpdate(updated);
    };

    const handleDelete = (id: string) => {
        const updated = transactions.filter(t => t.id !== id);
        onUpdate(updated);
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    const totalSelected = transactions.filter(t => t.selected).length;
    const totalIncome = transactions.filter(t => t.selected && t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.selected && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">Selecionados:</span>
                        <span className="ml-1 font-semibold text-gray-900 dark:text-white">{totalSelected}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">Receitas:</span>
                        <span className="ml-1 font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">Despesas:</span>
                        <span className="ml-1 font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalExpense)}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-gray-200 dark:bg-gray-700' : ''}>Todos</Button>
                    <Button variant="ghost" size="sm" onClick={() => setFilter('income')} className={filter === 'income' ? 'bg-green-100 text-green-700' : ''}>Receitas</Button>
                    <Button variant="ghost" size="sm" onClick={() => setFilter('expense')} className={filter === 'expense' ? 'bg-red-100 text-red-700' : ''}>Despesas</Button>
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                            <tr>
                                <th className="p-4 w-4">
                                    <input
                                        type="checkbox"
                                        checked={transactions.length > 0 && transactions.every(t => t.selected)}
                                        onChange={handleToggleAll}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Descrição</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3 text-right">Valor</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${!transaction.selected ? 'opacity-50' : ''}`}
                                >
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={transaction.selected}
                                            onChange={() => handleToggleSelect(transaction.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {transaction.date.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={transaction.description}
                                            onChange={(e) => handleChangeDescription(transaction.id, e.target.value)}
                                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={transaction.category}
                                            onChange={(e) => handleChangeCategory(transaction.id, e.target.value)}
                                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full text-sm py-1"
                                        >
                                            {(transaction.type === 'income' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button onClick={onSave} isLoading={isLoading} disabled={totalSelected === 0}>
                    Importar {totalSelected} Transações
                </Button>
            </div>
        </div>
    );
}
