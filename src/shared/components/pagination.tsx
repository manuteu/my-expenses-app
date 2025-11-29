import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPreviousPage: () => void
  onNextPage: () => void
  itemLabel?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPreviousPage,
  onNextPage,
  itemLabel = "registros"
}: PaginationProps) {
  const startItem = ((currentPage - 1) * limit) + 1
  const endItem = Math.min(currentPage * limit, total)

  return (
    <div className="flex md:flex-row flex-col gap-2 items-center md:justify-between justify-center px-2 flex-wrap">
      <div className="text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {total} {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <div className="text-sm text-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

