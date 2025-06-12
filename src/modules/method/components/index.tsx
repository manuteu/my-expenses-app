import { useGetMethod } from "../hooks"

export default function ListMethods() {
  const { data, isLoading } = useGetMethod()

  return (
    <div>
      <span>ListMethods</span>

    {!isLoading && data?.map(item => (
      <div>
        {item.name}
      </div>
    ))}
    </div>
  )
}
