import { type Orcamento, MESES } from '../../types/orcamento';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/financial';

interface OrcamentoCardProps {
    orcamento: Orcamento;
    onEdit: (orcamento: Orcamento) => void;
    onDelete: (id: string) => void;
}

export function OrcamentoCard({ orcamento, onEdit, onDelete }: OrcamentoCardProps) {
    const percentualGasto = Math.min((orcamento.valor_gasto / orcamento.valor_total) * 100, 100);
    const mesNome = MESES.find(m => m.value === orcamento.mes)?.label;

    const isExcedido = orcamento.valor_gasto > orcamento.valor_total;
    const isConcluido = orcamento.status === 'concluido';

    // Top 3 categorias com maior gasto
    const topCategorias = [...orcamento.categorias]
        .sort((a, b) => b.valor_gasto - a.valor_gasto)
        .slice(0, 3);

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${isExcedido ? 'bg-red-500' : isConcluido ? 'bg-gray-400' : 'bg-blue-500'
                }`} />

            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {mesNome} {orcamento.ano}
                            </span>
                            {isExcedido && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Excedido
                                </span>
                            )}
                            {isConcluido && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Concluído
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                            {orcamento.nome}
                        </h3>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(orcamento)} className="h-8 w-8">
                            <Edit2 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(orcamento.id)} className="h-8 w-8 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gasto</p>
                            <p className={`text-2xl font-bold ${isExcedido ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                {formatCurrency(orcamento.valor_gasto)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Limite</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                {formatCurrency(orcamento.valor_total)}
                            </p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${isExcedido ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${percentualGasto}%` }}
                        />
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            Maiores Gastos
                        </p>
                        <div className="space-y-2">
                            {topCategorias.map((cat, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.cor }} />
                                        <span className="text-gray-700 dark:text-gray-300 capitalize">{cat.categoria}</span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatCurrency(cat.valor_gasto)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
