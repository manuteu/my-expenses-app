import ExpenseAnalyticsMonthly from "./expense-analytics-monthly";
import DashboardPendingExpensesTable from "./dashboard-pending-expenses-table";
import ExpensesDonutChart from "./expenses-donut-chart";
import ExpensesChart from "./expenses-chart";

interface DashboardExpensesOverviewProps {
  startDate?: string;
  endDate?: string;
}

export default function DashboardExpensesOverview({
  startDate,
  endDate,
}: DashboardExpensesOverviewProps) {
  return (
    <section className="space-y-6">
      {/* row 1 */}
      <ExpenseAnalyticsMonthly startDate={startDate} endDate={endDate} />

      {/* row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-6 gap-4">
        <DashboardPendingExpensesTable />
        <ExpensesDonutChart startDate={startDate} endDate={endDate} />
      </div>

      {/* row 3 */}
      <ExpensesChart startDate={startDate} endDate={endDate} />
    </section>
  );
}
