import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label as RechartsLabel } from "recharts";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useGetExpensesChart } from "../hooks";
import { DateRangePicker } from "@/shared/ui/date-range-picker";
import { Label } from "@/shared/ui/label";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { getCurrentMonthRange } from "@/shared/lib/date";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

// Paleta de cores para os métodos de pagamento
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export default function ExpensesDonutChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange());

  // Só chama a API quando ambas as datas forem selecionadas
  const startDateString = dateRange?.from && dateRange?.to ? dateRange.from.toISOString() : undefined;
  const endDateString = dateRange?.from && dateRange?.to ? dateRange.to.toISOString() : undefined;

  const { data, isLoading } = useGetExpensesChart(startDateString, endDateString);

  // Processar dados para o gráfico - agrupar por método
  const chartData = useMemo(() => {
    if (!data) return [];

    // Agrupar despesas por método
    const groupedByMethod = data.reduce((acc, expense) => {
      const methodName = expense.method || 'Sem método';

      if (!acc[methodName]) {
        acc[methodName] = {
          method: methodName,
          total: 0,
          count: 0,
        };
      }

      acc[methodName].total += expense.amount;
      acc[methodName].count += 1;

      return acc;
    }, {} as Record<string, { method: string; total: number; count: number }>);

    // Converter para array
    return Object.values(groupedByMethod)
      .map((value) => ({
        name: value.method,
        value: value.total / 100, // Converter centavos para reais
        count: value.count,
        totalCents: value.total, // Manter valor em centavos para formatação
      }));
  }, [data]);

  // Calcular total geral
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Custom tooltip para formatar valores
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalAmount > 0 ? ((data.value / totalAmount) * 100).toFixed(1) : 0;

      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{formatCentsToCurrency(data.totalCents)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {data.count} despesa(s) • {percentage}%
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
          {formatCentsToCurrency(totalAmount * 100)}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Despesas por Método
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Visualize suas despesas organizadas por método de pagamento
            </CardDescription>
          </div>

          {/* Filtro de período */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="date-range" className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Período
            </Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Selecione o período"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Carregando dados do gráfico...</p>
          </div>
        )}

        {!isLoading && chartData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-border rounded-lg">
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
                const percentage = totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(1) : 0;

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
                        {item.count} despesa(s) • {percentage}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">
                        {formatCentsToCurrency(item.totalCents)}
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

