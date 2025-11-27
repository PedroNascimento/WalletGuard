import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartData } from "../../types/relatorio";
import { Card } from "../ui/Card";

interface Props {
  data: ChartData[];
}

export const ReceitaDespesaChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 self-start px-6 pt-6">
          Evolução Receitas x Despesas
        </h3>
        <p>Sem dados para exibir no período.</p>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Evolução Receitas x Despesas
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]}
            />
            <Legend />
            <Bar
              dataKey="receitas"
              name="Receitas"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="despesas"
              name="Despesas"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
