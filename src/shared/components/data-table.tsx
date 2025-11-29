import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Skeleton } from "@/shared/ui/skeleton"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

export type FilterType = 'input' | 'select'

export interface FilterConfig {
  type: FilterType
  options?: Array<{ label: string; value: string }>
  placeholder?: string
}

export interface DataTableColumn<T> {
  header: string
  accessor?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  filter?: FilterConfig
  filterKey?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  skeletonRows?: number
  getRowKey: (item: T) => string
  skeletonWidths?: string[]
  filters?: Record<string, string>
  onFilterChange?: (filterKey: string, value: string) => void
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado",
  skeletonRows = 5,
  getRowKey,
  skeletonWidths = [],
  filters = {},
  onFilterChange
}: DataTableProps<T>) {
  // Gera larguras padrão para skeleton se não fornecidas
  const defaultSkeletonWidths = columns.map((_, index) => {
    if (skeletonWidths[index]) return skeletonWidths[index]
    return index === 0 ? "w-[150px]" : "w-[100px]"
  })

  const hasFilters = columns.some(column => column.filter)

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
          {hasFilters && (
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="py-2">
                  {column.filter && column.filterKey && onFilterChange ? (
                    column.filter.type === 'input' ? (
                      <Input
                        placeholder={column.filter.placeholder || `Filtrar ${column.header.toLowerCase()}`}
                        value={filters[column.filterKey] || ''}
                        onChange={(e) => onFilterChange(column.filterKey!, e.target.value)}
                        className="h-8 text-sm"
                      />
                    ) : column.filter.type === 'select' ? (
                      <Select
                        value={filters[column.filterKey] || ''}
                        onValueChange={(value) => onFilterChange(column.filterKey!, value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder={column.filter.placeholder || 'Selecione uma opção'} />
                        </SelectTrigger>
                        <SelectContent>
                          {column.filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null
                  ) : null}
                </TableHead>
              ))}
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className={`h-5 ${defaultSkeletonWidths[colIndex]}`} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {!isLoading && data.length > 0 && data.map((item) => (
            <TableRow key={getRowKey(item)}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.className}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessor
                    ? String(item[column.accessor])
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

