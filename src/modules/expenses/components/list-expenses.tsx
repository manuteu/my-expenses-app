import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useGetExpenses } from "../hooks"
import CreateExpenseDialog from "./create-expense-dialog"
import { formatCentsToCurrency } from "@/shared/lib/currency"
import { formatDateToBR } from "@/shared/lib/date"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"

const EXPENSE_TYPE_LABELS = {
  simple: 'Simples',
  installment: 'Parcelada',
  recurring: 'Recorrente'
}

export default function ListExpenses() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useGetExpenses(page, limit)

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Despesas</h2>
        <CreateExpenseDialog />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </>
            )}

            {!isLoading && expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhuma despesa cadastrada
                </TableCell>
              </TableRow>
            )}

            {!isLoading && expenses.length > 0 && expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell className="font-medium">
                  {expense.description || '-'}
                </TableCell>
                <TableCell>
                  {expense.method.name}
                </TableCell>
                <TableCell>
                  {formatDateToBR(expense.date)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{EXPENSE_TYPE_LABELS[expense.type]}</span>
                    {expense.type === 'installment' && (
                      <span className="text-xs text-muted-foreground">
                        {expense.installmentNumber}/{expense.totalInstallments}x
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCentsToCurrency(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, metadata.total)} de {metadata.total} despesas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm text-foreground">
              Página {page} de {metadata.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === metadata.totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
