import ExpensesChart from "@/modules/expenses/components/expenses-chart";
import ExpensesDonutChart from "@/modules/expenses/components/expenses-donut-chart";

export default function DashboardPage() {
  return (
    <main className="bg-background space-y-6">
      {/* Gráficos de despesas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de barras por categoria */}
        <ExpensesChart />
        
        {/* Gráfico donut por método */}
        <ExpensesDonutChart />
      </div>
    </main>
  )
}
