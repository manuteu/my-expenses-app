import ExpensesChart from "@/modules/expenses/components/expenses-chart";
import ExpensesDonutChart from "@/modules/expenses/components/expenses-donut-chart";
import ExpenseAnalyticsMonthly from "@/modules/expenses/components/expense-analytics-monthly";

export default function DashboardPage() {
  return (
    <main className="bg-background space-y-6">
      {/* Cards analíticos */}
      <ExpenseAnalyticsMonthly />
      {/* Gráficos de despesas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-6 gap-4">
        {/* Gráfico de barras por categoria */}
        <ExpensesChart />
        
        {/* Gráfico donut por método */}
        <ExpensesDonutChart />
      </div>
    </main>
  )
}
