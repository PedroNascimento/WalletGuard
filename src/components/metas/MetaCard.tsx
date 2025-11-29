import { type Meta, META_CATEGORIAS } from '../../types/meta';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/financial';

interface MetaCardProps {
    meta: Meta;
    onEdit: (meta: Meta) => void;
    onDelete: (id: string) => void;
    onContribute: (meta: Meta) => void;
}

export function MetaCard({ meta, onEdit, onDelete, onContribute }: MetaCardProps) {
    const progresso = Math.min((meta.valor_atual / meta.valor_alvo) * 100, 100);
    const categoriaInfo = META_CATEGORIAS.find(c => c.value === meta.categoria);

    // Calcular dias restantes
    const hoje = new Date();
    const prazo = new Date(meta.prazo);
    const diffTime = prazo.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isAtrasada = diasRestantes < 0 && meta.status !== 'concluida';
    const isConcluida = meta.status === 'concluida';

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
            <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: meta.cor }}
            />

            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                {categoriaInfo?.label || meta.categoria}
                            </span>
                            {isConcluida && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Concluída
                                </span>
                            )}
                            {isAtrasada && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    Atrasada
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1" title={meta.titulo}>
                            {meta.titulo}
                        </h3>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(meta)} className="h-8 w-8">
                            <Edit2 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(meta.id)} className="h-8 w-8 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                            <span className="font-medium text-gray-900 dark:text-white">{Math.round(progresso)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progresso}%`, backgroundColor: meta.cor }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Atual</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(meta.valor_atual)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Alvo</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(meta.valor_alvo)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {isConcluida ? 'Concluída em ' + new Date(meta.updated_at).toLocaleDateString() :
                                isAtrasada ? `Atrasada há ${Math.abs(diasRestantes)} dias` :
                                    `Restam ${diasRestantes} dias`}
                        </span>
                    </div>
                </div>

                {!isConcluida && (
                    <Button
                        className="w-full mt-4 gap-2"
                        onClick={() => onContribute(meta)}
                        style={{ backgroundColor: meta.cor + '15', color: meta.cor }} // Tinted background
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Valor
                    </Button>
                )}
            </div>
        </Card>
    );
}
