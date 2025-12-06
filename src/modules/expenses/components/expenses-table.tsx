import { Trash } from "lucide-react"
import { formatCentsToCurrency } from "@/shared/lib/currency"
import { formatDateToBR } from "@/shared/lib/date"
import { DataTable, type DataTableColumn } from "@/shared/components"
import { Button } from "@/shared/ui/button"
import { useGetCategories } from "@/modules/category/hooks"
import type { Expense } from "../types"

const EXPENSE_TYPE_LABELS = {
  simple: 'Simples',
  installment: 'Parcelada',
  recurring: 'Recorrente'
}

interface ExpensesTableProps {
  expenses: Expense[]
  isLoading: boolean
  onDelete: (expense: Expense) => void
  isDeleting?: boolean
  filters?: Record<string, string>
  onFilterChange?: (filterKey: string, value: string) => void
}

export default function ExpensesTable({
  expenses,
  isLoading,
  onDelete,
  isDeleting = false,
  filters,
  onFilterChange
}: ExpensesTableProps) {
  const { data: categories } = useGetCategories()

  const categoryOptions = [
    { label: 'Todas', value: 'all' },
    ...(categories
      ?.filter((category) => category.isActive)
      .map((category) => ({
        label: category.icon ? `${category.icon} ${category.name}` : category.name,
        value: category.name
      })) || [])
  ]

  const columns: DataTableColumn<Expense>[] = [
    {
      header: "Descrição",
      cell: (expense) => (
        <span className="font-medium">{expense.description || '-'}</span>
      ),
      filter: {
        type: 'input',
        placeholder: 'Buscar descrição...'
      },
      filterKey: 'description'
    },
    {
      header: "Método",
      cell: (expense) => expense.method.name,
      filter: {
        type: 'input',
        placeholder: 'Buscar método...'
      },
      filterKey: 'methodName'
    },
    {
      header: "Data",
      cell: (expense) => formatDateToBR(expense.date)
    },
    {
      header: "Tipo",
      cell: (expense) => (
        <div className="flex flex-col gap-1">
          <span>{EXPENSE_TYPE_LABELS[expense.type]}</span>
          {expense.type === 'installment' && (
            <span className="text-xs text-muted-foreground">
              {expense.installmentNumber}/{expense.totalInstallments}x
            </span>
          )}
        </div>
      ),
      filter: {
        type: 'select',
        placeholder: 'Filtrar tipo',
        options: [
          { label: 'Todas', value: 'all' },
          { label: 'Simples', value: 'simple' },
          { label: 'Parcelada', value: 'installment' },
          { label: 'Recorrente', value: 'recurring' }
        ]
      },
      filterKey: 'type'
    },
    {
      header: "Categoria",
      cell: (expense) => expense.category.icon,
      filter: {
        type: 'select',
        placeholder: 'Filtrar categoria',
        options: categoryOptions
      },
      filterKey: 'categoryName'
    },
    {
      header: "Valor",
      cell: (expense) => (
        <span className="font-semibold">{formatCentsToCurrency(expense.amount)}</span>
      ),
      className: "text"
    },
    {
      header: "Excluir",
      cell: (expense) => (
        <Button 
          variant="ghost" 
          onClick={() => onDelete(expense)} 
          disabled={isDeleting}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      ),
      className: "text-center font-semibold"
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={expenses}
      isLoading={isLoading}
      emptyMessage="Nenhuma despesa cadastrada"
      getRowKey={(expense) => expense._id}
      skeletonRows={5}
      skeletonWidths={['w-[150px]', 'w-[100px]', 'w-[80px]', 'w-[60px]', 'w-[60px]', 'w-[60px]', 'w-[60px]']}
      filters={filters}
      onFilterChange={onFilterChange}
    />
  )
}

