import { supabase } from "./supabase";
import type {
  RelatorioFilters,
  ChartData,
  CategoryData,
  PrevisaoItem,
  ResumoFinanceiro,
} from "../types/relatorio";
import { addMonths, format, parseISO } from "date-fns";

export const relatoriosService = {
  async getDados(filters: RelatorioFilters) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // 1. Buscar Receitas
    let receitasQuery = supabase
      .from("receitas")
      .select("*")
      .eq("user_id", user.id)
      .gte("data", filters.startDate)
      .lte("data", filters.endDate);

    if (filters.category)
      receitasQuery = receitasQuery.eq("categoria", filters.category);

    const { data: receitasData, error: receitasError } = await receitasQuery;
    if (receitasError) throw receitasError;

    // 2. Buscar Despesas Gerais
    let despesasQuery = supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", filters.startDate)
      .lte("date", filters.endDate);

    if (filters.category)
      despesasQuery = despesasQuery.eq("category", filters.category);

    const { data: despesasData, error: despesasError } = await despesasQuery;
    if (despesasError) throw despesasError;

    // 3. Buscar Despesas de Cartão
    let cardExpensesQuery = supabase
      .from("card_expenses")
      .select("*, cards(name)")
      .eq("user_id", user.id)
      .gte("date", filters.startDate)
      .lte("date", filters.endDate);

    if (filters.category)
      cardExpensesQuery = cardExpensesQuery.eq("category", filters.category);
    if (filters.cardId)
      cardExpensesQuery = cardExpensesQuery.eq("card_id", filters.cardId);

    const { data: cardExpensesData, error: cardError } =
      await cardExpensesQuery;
    if (cardError) throw cardError;

    const receitas = receitasData || [];
    const despesas = despesasData || [];
    const cardExpenses = cardExpensesData || [];

    // --- Processamento dos Dados ---

    // Resumo Financeiro
    const totalReceitas = receitas.reduce(
      (acc, curr) => acc + Number(curr.valor),
      0,
    );
    const totalDespesasGerais = despesas.reduce(
      (acc, curr) => acc + Number(curr.value),
      0,
    );
    const totalCardExpenses = cardExpenses.reduce(
      (acc, curr) => acc + Number(curr.value),
      0,
    );
    const totalDespesas = totalDespesasGerais + totalCardExpenses;

    const maiorReceita = receitas.sort(
      (a, b) => Number(b.valor) - Number(a.valor),
    )[0];
    const todasDespesas = [
      ...despesas.map((d) => ({
        description: d.description,
        value: Number(d.value),
        date: d.date,
      })),
      ...cardExpenses.map((d) => ({
        description: d.description,
        value: Number(d.value),
        date: d.date,
      })),
    ];
    const maiorDespesa = todasDespesas.sort((a, b) => b.value - a.value)[0];

    const resumo: ResumoFinanceiro = {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      maiorReceita: maiorReceita
        ? {
            description: maiorReceita.descricao,
            value: Number(maiorReceita.valor),
            date: maiorReceita.data,
          }
        : { description: "-", value: 0, date: "" },
      maiorDespesa: maiorDespesa
        ? {
            description: maiorDespesa.description,
            value: maiorDespesa.value,
            date: maiorDespesa.date,
          }
        : { description: "-", value: 0, date: "" },
    };

    // Dados para Gráfico de Evolução (Agrupado por Dia ou Mês dependendo do range)
    // Simplificação: Agrupar por dia
    const chartDataMap = new Map<string, ChartData>();

    // Inicializa mapa com datas do intervalo (opcional, mas bom para continuidade)
    // ... (pode ser complexo gerar todas as datas, vamos fazer sparse)

    receitas.forEach((r) => {
      const date = r.data;
      const current = chartDataMap.get(date) || {
        name: format(parseISO(date), "dd/MM"),
        receitas: 0,
        despesas: 0,
        saldo: 0,
      };
      current.receitas += Number(r.valor);
      current.saldo += Number(r.valor);
      chartDataMap.set(date, current);
    });

    despesas.forEach((d) => {
      const date = d.date;
      const current = chartDataMap.get(date) || {
        name: format(parseISO(date), "dd/MM"),
        receitas: 0,
        despesas: 0,
        saldo: 0,
      };
      current.despesas += Number(d.value);
      current.saldo -= Number(d.value);
      chartDataMap.set(date, current);
    });

    cardExpenses.forEach((d) => {
      const date = d.date;
      const current = chartDataMap.get(date) || {
        name: format(parseISO(date), "dd/MM"),
        receitas: 0,
        despesas: 0,
        saldo: 0,
      };
      current.despesas += Number(d.value);
      current.saldo -= Number(d.value);
      chartDataMap.set(date, current);
    });

    const evolutionChart = Array.from(chartDataMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((entry) => entry[1]);

    // Dados por Categoria
    const categoryMap = new Map<string, number>();

    despesas.forEach((d) => {
      const cat = d.category || "Outros";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(d.value));
    });

    cardExpenses.forEach((d) => {
      const cat = d.category || "Outros";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(d.value));
    });

    const categoryChart: CategoryData[] = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: generateColor(name),
        percentage: (value / totalDespesas) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      resumo,
      evolutionChart,
      categoryChart,
    };
  },

  async getPrevisao(months: number = 3) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const startDate = new Date();
    const endDate = addMonths(startDate, months);
    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    const previsoes: PrevisaoItem[] = [];

    // 1. Buscar Parcelas Futuras de Cartão
    const { data: cardExpenses } = await supabase
      .from("card_expenses")
      .select("*, cards(name)")
      .eq("user_id", user.id)
      .gte("date", startStr)
      .lte("date", endStr);

    cardExpenses?.forEach((item) => {
      previsoes.push({
        date: item.date,
        description: `${item.description} (Cartão: ${item.cards?.name})`,
        value: Number(item.value),
        type: "despesa",
        category: item.category,
        origin: "parcelado",
      });
    });

    // 2. Buscar Despesas Recorrentes (Fixas)
    // Isso é mais complexo pois precisa projetar.
    // Vamos buscar despesas ativas marcadas como recorrentes.
    const { data: recurringExpenses } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .eq("recurring", true);

    // Projetar recorrências
    recurringExpenses?.forEach((expense) => {
      let currentDate = new Date(expense.date);
      // Avançar até a data atual se for antiga
      while (currentDate < startDate) {
        if (expense.recurring_frequency === "monthly") {
          currentDate = addMonths(currentDate, 1);
        } else if (expense.recurring_frequency === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (expense.recurring_frequency === "yearly") {
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        } else {
          break; // Evitar loop infinito se frequência desconhecida
        }
      }

      // Adicionar ocorrências futuras
      while (currentDate <= endDate) {
        previsoes.push({
          date: currentDate.toISOString().split("T")[0],
          description: expense.description,
          value: Number(expense.value),
          type: "despesa",
          category: expense.category,
          origin: "recorrente",
        });

        if (expense.recurring_frequency === "monthly") {
          currentDate = addMonths(currentDate, 1);
        } else if (expense.recurring_frequency === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (expense.recurring_frequency === "yearly") {
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        } else {
          break;
        }
      }
    });

    // Ordenar por data
    return previsoes.sort((a, b) => a.date.localeCompare(b.date));
  },
};

// Helper para gerar cores consistentes baseadas na string da categoria
function generateColor(str: string): string {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
