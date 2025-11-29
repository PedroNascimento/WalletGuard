import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Plus, Target } from 'lucide-react';
import { type Meta, type MetaFormData } from '../../types/meta';
import { metasService } from '../../services/metas.service';
import { MetaCard } from '../../components/metas/MetaCard';
import { MetaForm } from '../../components/metas/MetaForm';
import { ContribuicaoForm } from '../../components/metas/ContribuicaoForm';
import { useToast } from '../../context/ToastContext';

export function Metas() {
    const [metas, setMetas] = useState<Meta[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showContribuicao, setShowContribuicao] = useState(false);
    const [editingMeta, setEditingMeta] = useState<Meta | undefined>(undefined);
    const [selectedMeta, setSelectedMeta] = useState<Meta | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    const loadMetas = async () => {
        try {
            setLoading(true);
            const data = await metasService.getAll();
            setMetas(data);
        } catch (error) {
            console.error('Erro ao carregar metas:', error);
            addToast('Erro ao carregar metas', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetas();
    }, []);

    const handleCreate = async (data: MetaFormData) => {
        try {
            setSubmitting(true);
            await metasService.create(data);
            addToast('Meta criada com sucesso!', 'success');
            setShowForm(false);
            loadMetas();
        } catch (error) {
            console.error('Erro ao criar meta:', error);
            addToast('Erro ao criar meta', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (data: MetaFormData) => {
        if (!editingMeta) return;
        try {
            setSubmitting(true);
            await metasService.update(editingMeta.id, data);
            addToast('Meta atualizada com sucesso!', 'success');
            setShowForm(false);
            setEditingMeta(undefined);
            loadMetas();
        } catch (error) {
            console.error('Erro ao atualizar meta:', error);
            addToast('Erro ao atualizar meta', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta meta?')) return;
        try {
            await metasService.delete(id);
            addToast('Meta excluída com sucesso!', 'success');
            loadMetas();
        } catch (error) {
            console.error('Erro ao excluir meta:', error);
            addToast('Erro ao excluir meta', 'error');
        }
    };

    const handleContribute = async (valor: number, observacao?: string) => {
        if (!selectedMeta) return;
        try {
            setSubmitting(true);
            await metasService.addContribuicao(selectedMeta.id, valor, observacao);
            addToast('Contribuição adicionada com sucesso!', 'success');
            setShowContribuicao(false);
            setSelectedMeta(undefined);
            loadMetas();
        } catch (error) {
            console.error('Erro ao adicionar contribuição:', error);
            addToast('Erro ao adicionar contribuição', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suas Metas</h1>
                    <p className="text-gray-500 dark:text-gray-400">Defina e acompanhe seus objetivos financeiros</p>
                </div>
                <Button onClick={() => { setEditingMeta(undefined); setShowForm(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Meta
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : metas.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma meta definida</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Comece a planejar seu futuro financeiro hoje mesmo.</p>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Meta
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metas.map((meta) => (
                        <MetaCard
                            key={meta.id}
                            meta={meta}
                            onEdit={(m) => { setEditingMeta(m); setShowForm(true); }}
                            onDelete={handleDelete}
                            onContribute={(m) => { setSelectedMeta(m); setShowContribuicao(true); }}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Formulário */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
                        <MetaForm
                            initialData={editingMeta}
                            onSubmit={editingMeta ? handleUpdate : handleCreate}
                            onCancel={() => setShowForm(false)}
                            isLoading={submitting}
                        />
                    </div>
                </div>
            )}

            {/* Modal de Contribuição */}
            {showContribuicao && selectedMeta && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                        <ContribuicaoForm
                            metaTitulo={selectedMeta.titulo}
                            onSubmit={handleContribute}
                            onCancel={() => setShowContribuicao(false)}
                            isLoading={submitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
