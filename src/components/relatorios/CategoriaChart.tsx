import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryData } from "../../types/relatorio";
import { Card } from "../ui/Card";

interface Props {
  data: CategoryData[];
}

export const CategoriaChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 self-start px-6 pt-6">
          Gastos por Categoria
        </h3>
        <p>Sem dados para exibir no período.</p>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Gastos por Categoria
      </h3>
      <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2 h-[250px] md:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 overflow-y-auto max-h-[250px] pr-2">
          <table className="w-full text-sm">
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <td className="py-2 flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                    {item.percentage.toFixed(1)}%
                  </td>
                  <td className="py-2 text-right text-gray-500 dark:text-gray-400">
                    R$ {item.value.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
