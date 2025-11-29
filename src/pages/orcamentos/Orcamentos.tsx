import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Plus, Calculator } from 'lucide-react';
import { type Orcamento, type OrcamentoFormData } from '../../types/orcamento';
import { orcamentosService } from '../../services/orcamentos.service';
import { OrcamentoCard } from '../../components/orcamentos/OrcamentoCard';
import { OrcamentoForm } from '../../components/orcamentos/OrcamentoForm';
import { useToast } from '../../context/ToastContext';

export function Orcamentos() {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    const loadOrcamentos = async () => {
        try {
            setLoading(true);
            // Sincronizar orçamento atual antes de carregar
            const now = new Date();
            await orcamentosService.syncValorGasto(now.getMonth() + 1, now.getFullYear());

            const data = await orcamentosService.getAll();
            setOrcamentos(data);
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            addToast('Erro ao carregar orçamentos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrcamentos();
    }, []);

    const handleCreate = async (data: OrcamentoFormData) => {
        try {
            setSubmitting(true);
            await orcamentosService.create(data);
            addToast('Orçamento criado com sucesso!', 'success');
            setShowForm(false);
            loadOrcamentos();
        } catch (error) {
            console.error('Erro ao criar orçamento:', error);
            addToast('Erro ao criar orçamento', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (data: OrcamentoFormData) => {
        if (!editingOrcamento) return;
        try {
            setSubmitting(true);
            await orcamentosService.update(editingOrcamento.id, data);
            addToast('Orçamento atualizado com sucesso!', 'success');
            setShowForm(false);
            setEditingOrcamento(undefined);
            loadOrcamentos();
        } catch (error) {
            console.error('Erro ao atualizar orçamento:', error);
            addToast('Erro ao atualizar orçamento', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;
        try {
            await orcamentosService.delete(id);
            addToast('Orçamento excluído com sucesso!', 'success');
            loadOrcamentos();
        } catch (error) {
            console.error('Erro ao excluir orçamento:', error);
            addToast('Erro ao excluir orçamento', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orçamentos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Planeje e controle seus gastos mensais</p>
                </div>
                <Button onClick={() => { setEditingOrcamento(undefined); setShowForm(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Orçamento
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : orcamentos.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum orçamento definido</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Comece a planejar seus gastos para ter mais controle.</p>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Orçamento
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orcamentos.map((orcamento) => (
                        <OrcamentoCard
                            key={orcamento.id}
                            orcamento={orcamento}
                            onEdit={(o) => { setEditingOrcamento(o); setShowForm(true); }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <OrcamentoForm
                            initialData={editingOrcamento}
                            onSubmit={editingOrcamento ? handleUpdate : handleCreate}
                            onCancel={() => setShowForm(false)}
                            isLoading={submitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
