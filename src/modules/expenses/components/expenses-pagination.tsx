import { Pagination } from "@/shared/components"

interface ExpensesPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPreviousPage: () => void
  onNextPage: () => void
}

export default function ExpensesPagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPreviousPage,
  onNextPage
}: ExpensesPaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPreviousPage={onPreviousPage}
      onNextPage={onNextPage}
      itemLabel="despesas"
    />
  )
}

