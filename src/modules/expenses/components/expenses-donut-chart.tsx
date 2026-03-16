import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label as RechartsLabel } from "recharts";
import { useGetExpensesChartByMethod } from "../hooks";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

// Paleta de cores para os métodos de pagamento
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

interface ExpensesDonutChartProps {
  startDate?: string;
  endDate?: string;
}

export default function ExpensesDonutChart({ startDate, endDate }: ExpensesDonutChartProps) {
  const { data, isLoading } = useGetExpensesChartByMethod(startDate, endDate);
  const formatAmount = (amount: number) => formatCentsToCurrency(amount);

  // Dados já chegam agregados por método
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      name: item.methodName,
      value: item.totalAmount,
      count: item.expenseCount,
      percentage: item.percentage,
    }));
  }, [data]);

  const totalAmount = data?.totalAmount ?? 0;

  // Custom tooltip para formatar valores
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const chartItem = payload[0].payload;

      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{chartItem.name}</p>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{formatAmount(chartItem.value)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {chartItem.count} despesa(s) • {chartItem.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label para exibir percentual nas fatias
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Só mostra o label se o percentual for maior que 5%
    // if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Componente de texto customizado no centro do donut
  const CenterText = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.5em" className="text-2xl font-bold fill-foreground">
          {formatAmount(totalAmount)}
        </tspan>
        <tspan x={cx} dy="1.5em" className="text-sm fill-muted-foreground">
          Total
        </tspan>
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Despesas por Método
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize suas despesas organizadas por método de pagamento
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
            {/* Gráfico de pizza (donut) */}
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  innerRadius={90}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <RechartsLabel content={<CenterText />} position="center" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Lista de métodos com valores */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chartData.map((item, index) => {
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} despesa(s) • {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">
                        {formatAmount(item.value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

