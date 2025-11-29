import Papa from 'papaparse';
import type { ImportedTransaction } from '../types/import';

export const importService = {
    async parseFile(file: File): Promise<ImportedTransaction[]> {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension === 'csv') {
            return this.parseCSV(file);
        } else if (extension === 'ofx') {
            return this.parseOFX(file);
        } else {
            throw new Error('Formato de arquivo não suportado. Use .csv ou .ofx');
        }
    },

    async parseCSV(file: File): Promise<ImportedTransaction[]> {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const transactions: ImportedTransaction[] = results.data.map((row: any, index) => {
                            // Tenta identificar colunas comuns
                            const dateStr = row.Data || row.Date || row.data || row.date;
                            const descStr = row.Descricao || row.Description || row.Historico || row.Memo || row.description || row.memo;
                            const amountStr = row.Valor || row.Amount || row.Value || row.amount || row.value;

                            if (!dateStr || !amountStr) return null;

                            const amount = this.parseAmount(amountStr);
                            const description = descStr || 'Sem descrição';
                            const type = amount >= 0 ? 'income' : 'expense';

                            return {
                                id: `csv-${index}-${Date.now()}`,
                                date: new Date(dateStr),
                                description: description,
                                amount: Math.abs(amount),
                                type: type,
                                category: this.categorizeTransaction(description, type),
                                originalDescription: description,
                                selected: true
                            };
                        }).filter((t): t is ImportedTransaction => t !== null);

                        resolve(transactions);
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => reject(error)
            });
        });
    },

    async parseOFX(file: File): Promise<ImportedTransaction[]> {
        const text = await file.text();
        const transactions: ImportedTransaction[] = [];

        // Regex simples para extrair transações OFX
        // Procura por blocos <STMTTRN>...</STMTTRN>
        const transactionRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
        // const typeRegex = /<TRNTYPE>(.*)/; // Unused
        const dateRegex = /<DTPOSTED>(.*)/;
        const amountRegex = /<TRNAMT>(.*)/;
        const memoRegex = /<MEMO>(.*)/;
        const nameRegex = /<NAME>(.*)/;

        let match;
        let index = 0;
        while ((match = transactionRegex.exec(text)) !== null) {
            const block = match[1];

            // const typeMatch = block.match(typeRegex); // Unused
            const dateMatch = block.match(dateRegex);
            const amountMatch = block.match(amountRegex);
            const memoMatch = block.match(memoRegex);
            const nameMatch = block.match(nameRegex);

            if (dateMatch && amountMatch) {
                const rawDate = dateMatch[1].trim().substring(0, 8); // YYYYMMDD
                const year = parseInt(rawDate.substring(0, 4));
                const month = parseInt(rawDate.substring(4, 6)) - 1;
                const day = parseInt(rawDate.substring(6, 8));
                const date = new Date(year, month, day);

                const amount = parseFloat(amountMatch[1].trim().replace(',', '.'));
                const description = (memoMatch ? memoMatch[1] : (nameMatch ? nameMatch[1] : 'Sem descrição')).trim();
                const type = amount >= 0 ? 'income' : 'expense';

                transactions.push({
                    id: `ofx-${index++}-${Date.now()}`,
                    date: date,
                    description: description,
                    amount: Math.abs(amount),
                    type: type,
                    category: this.categorizeTransaction(description, type),
                    originalDescription: description,
                    selected: true
                });
            }
        }

        return transactions;
    },

    parseAmount(value: string | number): number {
        if (typeof value === 'number') return value;
        // Remove R$, espaços e converte vírgula para ponto se necessário
        let clean = value.replace(/[R$\s]/g, '');
        if (clean.includes(',') && clean.includes('.')) {
            // Formato 1.000,00 -> remove ponto, troca vírgula por ponto
            clean = clean.replace(/\./g, '').replace(',', '.');
        } else if (clean.includes(',')) {
            // Formato 1000,00 -> troca vírgula por ponto
            clean = clean.replace(',', '.');
        }
        return parseFloat(clean);
    },

    categorizeTransaction(description: string, type: 'income' | 'expense'): string {
        const desc = description.toLowerCase();

        if (type === 'income') {
            if (desc.includes('salario') || desc.includes('pagamento') || desc.includes('remuneracao')) return 'Salário';
            if (desc.includes('freelance') || desc.includes('servico')) return 'Freelance';
            if (desc.includes('investimento') || desc.includes('rendimento') || desc.includes('dividendo')) return 'Investimentos';
            if (desc.includes('venda')) return 'Vendas';
            return 'Outros';
        } else {
            if (desc.includes('uber') || desc.includes('99') || desc.includes('posto') || desc.includes('combustivel') || desc.includes('gasolina')) return 'Transporte';
            if (desc.includes('mercado') || desc.includes('supermercado') || desc.includes('ifood') || desc.includes('restaurante') || desc.includes('padaria')) return 'Alimentação';
            if (desc.includes('aluguel') || desc.includes('condominio') || desc.includes('luz') || desc.includes('agua') || desc.includes('internet')) return 'Moradia';
            if (desc.includes('farmacia') || desc.includes('medico') || desc.includes('hospital') || desc.includes('exame')) return 'Saúde';
            if (desc.includes('cinema') || desc.includes('netflix') || desc.includes('spotify') || desc.includes('jogo')) return 'Lazer';
            return 'Outros';
        }
    }
};
