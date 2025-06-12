import { useGetCards } from "../hooks/useGetCards"

export default function ListCard() {

  const { data, isLoading } = useGetCards()

  return (
    <div>
      <span>ListCard</span>

    {!isLoading && data?.map(item => (
      <div>
        {item.lastDigits}
      </div>
    ))}
    </div>
  )
}
