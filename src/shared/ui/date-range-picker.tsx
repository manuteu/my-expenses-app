import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  onApply?: (range: DateRange | undefined) => void
  onClear?: () => void
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onApply,
  onClear,
  placeholder = "Selecione o período",
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempDateRange, setTempDateRange] = React.useState<DateRange | undefined>(dateRange)

  // Atualiza o estado temporário quando o dateRange externo muda
  React.useEffect(() => {
    setTempDateRange(dateRange)
  }, [dateRange])

  const handleDateSelect = (range: DateRange | undefined) => {
    // Se from e to forem a mesma data, trata como se apenas from foi selecionado
    if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
      setTempDateRange({ from: range.from, to: undefined })
      return
    }
    
    setTempDateRange(range)
  }

  const handleApply = () => {
    onApply?.(tempDateRange)
    onDateRangeChange?.(tempDateRange)
    setOpen(false)
  }

  const handleClear = () => {
    setTempDateRange(undefined)
    onClear?.()
    onDateRangeChange?.(undefined)
  }

  const hasDateRange = tempDateRange?.from && tempDateRange?.to

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-lg" align="end">
        <Calendar
          mode="range"
          selected={tempDateRange}
          onSelect={handleDateSelect}
          locale={ptBR}
          numberOfMonths={2}
          min={1}
        />
        <div className="flex items-center justify-between gap-2 p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex-1"
          >
            Limpar
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!hasDateRange}
            className="flex-1"
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

