import { useState } from "react";
import { addDays, endOfMonth, format, startOfDay } from "date-fns";
import { useNavigate } from "react-router";
import { DataTable, type DataTableColumn, Pagination } from "@/shared/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { formatDateToBR } from "@/shared/lib/date";
import { formatCentsToCurrency } from "@/shared/lib/currency";
import { useGetExpenses } from "../hooks";
import type { Expense } from "../types";

const DASHBOARD_PAGE_LIMIT = 10;

export default function DashboardPendingExpensesTable() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const tomorrow = startOfDay(addDays(new Date(), 1));
  const startDate = format(tomorrow, "yyyy-MM-dd");
  const endDate = format(endOfMonth(tomorrow), "yyyy-MM-dd");

  const { data, isLoading } = useGetExpenses(page, DASHBOARD_PAGE_LIMIT, startDate, endDate);

  const expenses = data?.data ?? [];
  const metadata = data?.metadata;

  const columns: DataTableColumn<Expense>[] = [
    {
      header: "Descrição",
      cell: (expense) => <span className="font-medium">{expense.description || "-"}</span>,
    },
    {
      header: "Categoria",
      cell: (expense) => (
        <span>
          {expense.category.icon} {expense.category.name}
        </span>
      ),
    },
    {
      header: "Data",
      cell: (expense) => formatDateToBR(expense.date),
    },
    {
      header: "Valor",
      cell: (expense) => <span className="font-semibold">{formatCentsToCurrency(expense.amount)}</span>,
    },
  ];

  const handlePreviousPage = () => {
    setPage((previousPage) => Math.max(previousPage - 1, 1));
  };

  const handleNextPage = () => {
    if (!metadata) return;
    if (page < metadata.totalPages) {
      setPage((previousPage) => previousPage + 1);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Despesas Pendentes
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize suas despesas pendentes
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/expenses")}>
          Ver todas
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable
          columns={columns}
          data={expenses}
          isLoading={isLoading}
          emptyMessage="Nenhuma despesa pendente para o restante do mês"
          getRowKey={(expense) => expense._id}
          skeletonRows={DASHBOARD_PAGE_LIMIT}
          skeletonWidths={["w-[170px]", "w-[140px]", "w-[100px]", "w-[100px]"]}
        />

        {metadata && metadata.total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={metadata.totalPages}
            total={metadata.total}
            limit={DASHBOARD_PAGE_LIMIT}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            itemLabel="despesas pendentes"
          />
        )}
      </CardContent>
    </Card>
  );
}
