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
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Selecione o período",
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (range: DateRange | undefined) => {
    // Se from e to forem a mesma data, trata como se apenas from foi selecionado
    if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
      onDateRangeChange?.({ from: range.from, to: undefined })
      return
    }
    
    onDateRangeChange?.(range)
    // Só fecha o popover quando ambas as datas forem selecionadas e diferentes
    if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
      setOpen(false)
    }
  }

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
          selected={dateRange}
          onSelect={handleDateSelect}
          locale={ptBR}
          numberOfMonths={2}
          min={1}
        />
      </PopoverContent>
    </Popover>
  )
}

