import { useGetExpenses } from "../hooks"
import CreateExpenseDialog from "./create-expense-dialog"
import { formatCentsToCurrency } from "@/shared/lib/currency"

export default function ListExpenses() {

  const { data, isLoading } = useGetExpenses()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Despesas</h2>
        <CreateExpenseDialog />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Carregando despesas...</p>
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Nenhuma despesa cadastrada</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="space-y-3">
          {data.map(item => (
            <div key={item._id} className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.method.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">
                    {formatCentsToCurrency(item.amount)}
                  </p>
                  {item.type === 'installment' && (
                    <p className="text-sm text-muted-foreground">
                      {item.installmentNumber}/{item.totalInstallments}x
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
