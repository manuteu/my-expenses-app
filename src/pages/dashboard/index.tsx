import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import ExpensesChart from "@/modules/expenses/components/expenses-chart";
import ExpensesDonutChart from "@/modules/expenses/components/expenses-donut-chart";
import ExpenseAnalyticsMonthly from "@/modules/expenses/components/expense-analytics-monthly";
import { DateRangePicker } from "@/shared/ui/date-range-picker";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";
import { getCurrentMonthRange } from "@/shared/lib/date";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange());

  const handleDateRangeApply = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleDateRangeClear = () => {
    setDateRange(undefined);
  };

  // Converte dateRange para strings no formato YYYY-MM-DD
  const startDateString = dateRange?.from && dateRange?.to ? dateRange.from.toISOString().split('T')[0] : undefined;
  const endDateString = dateRange?.from && dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined;

  return (
    <main className="bg-background space-y-6">
      {/* Filtro Global de Período */}
      <Card className="border-primary/20">
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">Filtro de Período</h2>
              <p className="text-sm text-muted-foreground">
                Selecione um período para visualizar as despesas em todos os gráficos e cards
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:w-64">
              <Label htmlFor="date-range" className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Período Selecionado
              </Label>
              <DateRangePicker
                dateRange={dateRange}
                onApply={handleDateRangeApply}
                onClear={handleDateRangeClear}
                placeholder="Selecione o período"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards analíticos */}
      <ExpenseAnalyticsMonthly 
        startDate={startDateString} 
        endDate={endDateString}
      />
      
      {/* Gráficos de despesas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-6 gap-4">
        {/* Gráfico de barras por categoria */}
        <ExpensesChart 
          dateRange={dateRange}
          startDate={startDateString}
          endDate={endDateString}
        />
        
        {/* Gráfico donut por método */}
        <ExpensesDonutChart 
          dateRange={dateRange}
          startDate={startDateString}
          endDate={endDateString}
        />
      </div>
    </main>
  )
}
