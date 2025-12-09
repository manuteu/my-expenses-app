import ExpenseAnalyticsCard from "./expense-analytics-card";
import { useGetMonthlyAnalysis } from "../hooks";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { Clock, BanknoteArrowUp, BanknoteArrowDown, Banknote } from "lucide-react";

export default function ExpenseAnalyticsMonthly() {
  const { data: monthlyAnalysisData, isLoading: isMonthlyAnalysisLoading } = useGetMonthlyAnalysis();
  const pendingCount = monthlyAnalysisData?.pending.count || 0;
  const pendingTotalAmount = monthlyAnalysisData?.pending.total || 0;
  const paidTotalAmount = monthlyAnalysisData?.paid.total || 0;
  const totalAmount = monthlyAnalysisData?.total || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ExpenseAnalyticsCard
          title="Despesas Pendentes"
          value={pendingCount}
          icon={Clock}
          iconColor="text-orange-500"
          isLoading={isMonthlyAnalysisLoading}
        />
        <ExpenseAnalyticsCard
          title="Total de Despesas Pendentes"
          value={formatCentsToCurrency(pendingTotalAmount)}
          icon={BanknoteArrowUp}
          iconColor="text-green-500"
          isLoading={isMonthlyAnalysisLoading}
        />
        <ExpenseAnalyticsCard
          title="Total de Despesas Pagas"
          value={formatCentsToCurrency(paidTotalAmount)}
          icon={BanknoteArrowDown}
          iconColor="text-green-500"
          isLoading={isMonthlyAnalysisLoading}
        />
        <ExpenseAnalyticsCard
          title="Total de Despesas"
          value={formatCentsToCurrency(totalAmount)}
          icon={Banknote}
          iconColor="text-primary"
          isLoading={isMonthlyAnalysisLoading}
        />
      </div>
  );
}