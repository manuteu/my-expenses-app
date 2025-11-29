import { X } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { DateRangePicker } from "@/shared/ui/date-range-picker"
import CreateExpenseDialog from "./create-expense-dialog"
import type { DateRange } from "react-day-picker"

interface ExpensesHeaderProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  onClearFilter: () => void
}

export default function ExpensesHeader({
  dateRange,
  onDateRangeChange,
  onClearFilter
}: ExpensesHeaderProps) {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <h2 className="text-2xl font-bold text-foreground min-w-[200px]">Despesas</h2>
      <div className="flex items-center gap-2 flex-wrap flex-1 md:justify-end justify-center">
        <div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            placeholder="Filtrar por período"
          />
        </div>
        {(dateRange?.from || dateRange?.to) && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClearFilter}
            title="Limpar filtro"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <CreateExpenseDialog />
      </div>
    </div>
  )
}

