import { useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useGetExpensesChartByCategory } from "../hooks";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

interface ExpensesChartProps {
  startDate?: string;
  endDate?: string;
}

export default function ExpensesChart({ startDate, endDate }: ExpensesChartProps) {
  const { data, isLoading } = useGetExpensesChartByCategory(startDate, endDate);
  const formatAmount = (amount: number) => formatCentsToCurrency(amount);

  // Dados já chegam agregados por categoria
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      category: item.categoryName,
      icon: item.categoryIcon,
      color: item.categoryColor,
      total: item.totalAmount,
      count: item.expenseCount,
    }));
  }, [data]);

  const totalAmount = data?.totalAmount ?? 0;
  const totalExpensesCount = data?.totalExpensesCount ?? 0;

  // Custom tooltip para formatar valores
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = totalAmount > 0 ? ((payload[0].value / totalAmount) * 100).toFixed(1) : "0.0";
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">
            {payload[0].payload.icon} {payload[0].payload.category} ({percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{formatAmount(payload[0].value)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.count} despesa(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Despesas por Categoria
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize suas despesas organizadas por categoria
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-44 p-4">
            <p className="text-muted-foreground">Carregando dados do gráfico...</p>
          </div>
        )}

        {!isLoading && chartData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-border rounded-lg p-4">
            <p className="text-muted-foreground">Nenhuma despesa encontrada no período selecionado</p>
          </div>
        )}

        {!isLoading && chartData.length > 0 && (
          <>
            {/* Card com total */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total do Período</p>
              <p className="text-3xl font-bold text-foreground">
                {formatAmount(totalAmount)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalExpensesCount} despesa(s)
              </p>
            </div>

            {/* Gráfico de barras */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="category"
                  className="text-xs"
                  // angle={-45}
                  // textAnchor="end"
                  height={80}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar
                  dataKey="total"
                  radius={[8, 8, 0, 0]}
                  name="Total por Categoria"
                >
                  {chartData.map((item) => (
                    <Cell key={`bar-cell-${item.category}`} fill={item.color || "var(--primary)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

