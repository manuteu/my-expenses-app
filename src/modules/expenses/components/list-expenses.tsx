import { useState } from "react"
import { useDeleteExpense, useGetExpenses } from "../hooks"
import ExpensesHeader from "./expenses-header"
import ExpensesTable from "./expenses-table"
import ExpensesPagination from "./expenses-pagination"
import DeleteExpenseDialog from "./delete-expense-dialog"
import { getCurrentMonthRange } from "@/shared/lib/date"
import { useDebounce } from "@/shared/hooks"
import type { DateRange } from "react-day-picker"
import type { Expense, ExpenseFilters } from "../types"

export default function ListExpenses() {
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange())
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const limit = 10

  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined

  // Debounce dos filtros
  const debouncedFilters = useDebounce<ExpenseFilters>(filters, 1500)

  // Passa os filtros debounced para a API
  const { data, isLoading } = useGetExpenses(page, limit, startDate, endDate, debouncedFilters)
  const { mutate: deleteExpense, isPending } = useDeleteExpense()
  
  const expenses = data?.data ?? []
  const metadata = data?.metadata

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    if (metadata && page < metadata.totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handleOpenDeleteDialog = (expense: Expense) => {
    setExpenseToDelete(expense)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (expenseId: string, scope: 'single' | 'all') => {
    deleteExpense(
      { expenseId, scope: scope === 'all' ? 'all' : null },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setExpenseToDelete(null)
        }
      }
    )
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    // Reset para a primeira página quando o filtro muda
    setPage(1)
  }

  const handleClearFilter = () => {
    setDateRange(undefined)
    setPage(1)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    setPage(1) // Reseta para primeira página ao filtrar
  }

  return (
    <div className="space-y-4">
      <ExpensesHeader
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilter={handleClearFilter}
      />

      <ExpensesTable
        expenses={expenses}
        isLoading={isLoading}
        onDelete={handleOpenDeleteDialog}
        isDeleting={isPending}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {metadata && (
        <ExpensesPagination
          currentPage={page}
          totalPages={metadata.totalPages}
          total={metadata.total}
          limit={limit}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}

      <DeleteExpenseDialog
        expense={expenseToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </div>
  )
}
