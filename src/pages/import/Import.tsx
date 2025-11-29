import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImportDropzone } from '../../components/import/ImportDropzone';
import { TransactionPreview } from '../../components/import/TransactionPreview';
import { importService } from '../../services/import.service';
import { receitasService } from '../../services/receitas.service';
import { despesasService } from '../../services/despesas.service';
import type { ImportedTransaction } from '../../types/import';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Import() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
    const [transactions, setTransactions] = useState<ImportedTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ imported: 0, total: 0 });

    const handleFileSelect = async (file: File) => {
        setIsLoading(true);
        try {
            const parsed = await importService.parseFile(file);
            if (parsed.length === 0) {
                addToast('Nenhuma transação encontrada no arquivo.', 'warning');
                return;
            }
            setTransactions(parsed);
            setStep('preview');
            addToast(`${parsed.length} transações encontradas.`, 'success');
        } catch (error) {
            console.error(error);
            addToast('Erro ao ler arquivo. Verifique o formato.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const selected = transactions.filter(t => t.selected);
        if (selected.length === 0) return;

        setIsLoading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            // Processar em lotes ou sequencialmente (sequencial por segurança inicial)
            for (const t of selected) {
                try {
                    if (t.type === 'income') {
                        await receitasService.create({
                            descricao: t.description,
                            valor: t.amount,
                            data: t.date.toISOString(),
                            categoria: t.category,
                            recorrente: false
                        });
                    } else {
                        await despesasService.create({
                            descricao: t.description,
                            valor: t.amount,
                            data: t.date.toISOString(),
                            categoria: t.category,
                            tipo: 'variavel',
                            recorrente: false
                        });
                    }
                    successCount++;
                } catch (err) {
                    console.error(`Erro ao importar transação ${t.description}:`, err);
                    errorCount++;
                }
            }

            setStats({ imported: successCount, total: selected.length });
            setStep('success');

            if (errorCount > 0) {
                addToast(`Importação concluída com ${errorCount} erros.`, 'warning');
            } else {
                addToast('Todas as transações foram importadas com sucesso!', 'success');
            }

        } catch (error) {
            addToast('Erro crítico ao salvar transações.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Importação Concluída!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {stats.imported} de {stats.total} transações foram adicionadas ao seu controle financeiro.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => {
                        setStep('upload');
                        setTransactions([]);
                    }}>
                        Importar Outro Arquivo
                    </Button>
                    <Button onClick={() => navigate('/')}>
                        Ir para Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {step === 'preview' && (
                    <Button variant="ghost" size="icon" onClick={() => setStep('upload')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Importar Transações</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {step === 'upload'
                            ? 'Envie seu extrato bancário (OFX ou CSV) para automatizar seus lançamentos.'
                            : 'Revise e categorize suas transações antes de salvar.'}
                    </p>
                </div>
            </div>

            {step === 'upload' ? (
                <div className="max-w-xl mx-auto mt-8">
                    <ImportDropzone onFileSelect={handleFileSelect} isLoading={isLoading} />

                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Como funciona?</h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                            <li>Exporte o extrato do seu banco em formato <strong>OFX</strong> ou <strong>CSV</strong>.</li>
                            <li>Arraste o arquivo para a área acima.</li>
                            <li>O sistema tentará identificar automaticamente as categorias.</li>
                            <li>Você poderá revisar e editar tudo antes de confirmar.</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <TransactionPreview
                    transactions={transactions}
                    onUpdate={setTransactions}
                    onSave={handleSave}
                    onCancel={() => setStep('upload')}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
