import React, { useState, useEffect } from 'react';
import { RelatorioFiltersComponent } from '../../components/relatorios/RelatorioFilters';
import { ReceitaDespesaChart } from '../../components/relatorios/ReceitaDespesaChart';
import { CategoriaChart } from '../../components/relatorios/CategoriaChart';
import { PrevisaoTable } from '../../components/relatorios/PrevisaoTable';
import { relatoriosService } from '../../services/relatorios.service';
import type { RelatorioFilters, ChartData, CategoryData, PrevisaoItem, ResumoFinanceiro } from '../../types/relatorio';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

import { useToast } from '../../context/ToastContext';

export const Relatorios: React.FC = () => {
    const { addToast } = useToast();
    const [filters, setFilters] = useState<RelatorioFilters>({
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        category: undefined
    });

    const [loading, setLoading] = useState(false);
    const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
    const [evolutionData, setEvolutionData] = useState<ChartData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [previsaoData, setPrevisaoData] = useState<PrevisaoItem[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const dados = await relatoriosService.getDados(filters);
            setResumo(dados.resumo);
            setEvolutionData(dados.evolutionChart);
            setCategoryData(dados.categoryChart);

            const previsoes = await relatoriosService.getPrevisao(3);
            setPrevisaoData(previsoes);
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
            addToast('Erro ao gerar relatório.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();

            // Título
            doc.setFontSize(20);
            doc.text('Relatório Financeiro - WalletGuard', 14, 22);

            doc.setFontSize(10);
            doc.text(`Período: ${format(new Date(filters.startDate), 'dd/MM/yyyy')} a ${format(new Date(filters.endDate), 'dd/MM/yyyy')}`, 14, 30);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 35);

            // Resumo
            if (resumo) {
                doc.setFontSize(14);
                doc.text('Resumo do Período', 14, 45);

                const resumoData = [
                    ['Receitas Totais', `R$ ${resumo.totalReceitas.toFixed(2)}`],
                    ['Despesas Totais', `R$ ${resumo.totalDespesas.toFixed(2)}`],
                    ['Saldo', `R$ ${resumo.saldo.toFixed(2)}`],
                    ['Maior Despesa', `${resumo.maiorDespesa.description} (R$ ${resumo.maiorDespesa.value.toFixed(2)})`]
                ];

                autoTable(doc, {
                    startY: 50,
                    head: [['Item', 'Valor']],
                    body: resumoData,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246] }
                });
            }

            // Categorias
            doc.setFontSize(14);
            doc.text('Gastos por Categoria', 14, (doc as any).lastAutoTable.finalY + 15);

            const catBody = categoryData.map(c => [c.name, `${c.percentage.toFixed(1)}%`, `R$ ${c.value.toFixed(2)}`]);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Categoria', '%', 'Valor']],
                body: catBody,
                theme: 'grid'
            });

            // Previsões
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Previsão de Gastos Futuros', 14, 20);

            const prevBody = previsaoData.map(p => [
                format(new Date(p.date), 'dd/MM/yyyy'),
                p.description,
                p.category,
                p.origin,
                `R$ ${p.value.toFixed(2)}`
            ]);

            autoTable(doc, {
                startY: 25,
                head: [['Data', 'Descrição', 'Categoria', 'Origem', 'Valor']],
                body: prevBody,
                theme: 'striped'
            });

            // Forçar download via file-saver para garantir compatibilidade
            const pdfBlob = doc.output('blob');
            saveAs(pdfBlob, `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
            addToast('Relatório gerado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            addToast('Erro ao exportar PDF.', 'error');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios e Análises</h1>
                    <p className="text-gray-600 dark:text-gray-400">Visualize a saúde das suas finanças.</p>
                </div>
                <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                    <Download size={18} />
                    Exportar PDF
                </Button>
            </div>

            <RelatorioFiltersComponent
                filters={filters}
                onChange={setFilters}
                onApply={fetchData}
                loading={loading}
            />

            {resumo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-green-100 text-sm font-medium">Receitas do Período</p>
                                <p className="text-2xl font-bold">{formatCurrency(resumo.totalReceitas)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingDown size={24} />
                            </div>
                            <div>
                                <p className="text-red-100 text-sm font-medium">Despesas do Período</p>
                                <p className="text-2xl font-bold">{formatCurrency(resumo.totalDespesas)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Saldo do Período</p>
                                <p className="text-2xl font-bold">{formatCurrency(resumo.saldo)}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReceitaDespesaChart data={evolutionData} />
                <CategoriaChart data={categoryData} />
            </div>

            <PrevisaoTable data={previsaoData} />
        </div>
    );
};
