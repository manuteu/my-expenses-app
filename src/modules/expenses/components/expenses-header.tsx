import { DateRangePicker } from "@/shared/ui/date-range-picker"
import CreateExpenseDialog from "./create-expense-dialog"
import type { DateRange } from "react-day-picker"

interface ExpensesHeaderProps {
  dateRange: DateRange | undefined
  onDateRangeApply: (range: DateRange | undefined) => void
  onClearFilter: () => void
}

export default function ExpensesHeader({
  dateRange,
  onDateRangeApply,
  onClearFilter
}: ExpensesHeaderProps) {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <h2 className="text-2xl font-bold text-foreground min-w-[200px]">Despesas</h2>
      <div className="flex items-center gap-2 flex-wrap flex-1 md:justify-end justify-center">
        <div>
          <DateRangePicker
            dateRange={dateRange}
            onApply={onDateRangeApply}
            onClear={onClearFilter}
            placeholder="Filtrar por período"
          />
        </div>
        <CreateExpenseDialog />
      </div>
    </div>
  )
}

