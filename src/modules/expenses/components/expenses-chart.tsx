import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useGetExpensesChart } from "../hooks";
import { DateRangePicker } from "@/shared/ui/date-range-picker";
import { Label } from "@/shared/ui/label";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { getCurrentMonthRange } from "@/shared/lib/date";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function ExpensesChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange());

  // Só chama a API quando ambas as datas forem selecionadas
  const startDateString = dateRange?.from && dateRange?.to ? dateRange.from.toISOString() : undefined;
  const endDateString = dateRange?.from && dateRange?.to ? dateRange.to.toISOString() : undefined;

  const { data, isLoading } = useGetExpensesChart(startDateString, endDateString);

  const handleDateRangeApply = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleDateRangeClear = () => {
    setDateRange(undefined);
  };

  // Processar dados para o gráfico - agrupar por categoria
  const chartData = useMemo(() => {
    if (!data) return [];

    // Agrupar despesas por categoria
    const groupedByCategory = data.reduce((acc, expense) => {
      const categoryName = expense.category || 'Sem categoria';

      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          total: 0,
          count: 0,
        };
      }

      acc[categoryName].total += expense.amount;
      acc[categoryName].count += 1;

      return acc;
    }, {} as Record<string, { category: string; total: number; count: number }>);

    // Converter para array
    return Object.values(groupedByCategory)
      .map((value) => ({
        category: value.category,
        total: value.total / 100, // Converter centavos para reais para o gráfico
        count: value.count,
      }));
  }, [data]);

  // Calcular total geral
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total, 0);
  }, [chartData]);

  // Custom tooltip para formatar valores
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].payload.category}</p>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{formatCentsToCurrency(payload[0].value * 100)}</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Despesas por Categoria
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Visualize suas despesas organizadas por categoria
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
              onApply={handleDateRangeApply}
              onClear={handleDateRangeClear}
              placeholder="Selecione o período"
            />
          </div>
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
                {formatCentsToCurrency(totalAmount * 100)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {chartData.reduce((sum, item) => sum + item.count, 0)} despesa(s)
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
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                  name="Total por Categoria"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

