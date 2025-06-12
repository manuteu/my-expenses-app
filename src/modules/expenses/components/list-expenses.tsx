import { useGetExpenses } from "../hooks"

export default function ListExpenses() {

  const { data, isLoading } = useGetExpenses()

  return (
    <div>
      <span>ListExpenses</span>

    {!isLoading && data?.map(item => (
      <div>
        {item.description}
      </div>
    ))}
    </div>
  )
}
