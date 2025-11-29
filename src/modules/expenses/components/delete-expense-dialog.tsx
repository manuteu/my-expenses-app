import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Label } from "@/shared/ui/label"
import { AlertTriangle } from "lucide-react"
import type { Expense } from "../types"

interface DeleteExpenseDialogProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (expenseId: string, scope: 'single' | 'all') => void
  isPending?: boolean
}

export default function DeleteExpenseDialog({
  expense,
  open,
  onOpenChange,
  onConfirm,
  isPending = false
}: DeleteExpenseDialogProps) {
  const [deleteScope, setDeleteScope] = useState<'single' | 'all'>('single')

  const handleConfirm = () => {
    if (!expense) return
    onConfirm(expense._id, deleteScope)
  }

  const isInstallment = expense?.type === 'installment'
  const isRecurring = expense?.type === 'recurring'
  const showScopeOptions = isInstallment || isRecurring

  const getScopeLabel = () => {
    if (isInstallment) {
      return {
        single: `Apenas esta parcela (${expense?.installmentNumber}/${expense?.totalInstallments})`,
        all: `Todas as ${expense?.totalInstallments} parcelas`
      }
    }
    if (isRecurring) {
      return {
        single: 'Apenas esta recorrência',
        all: 'Todas as recorrências futuras'
      }
    }
    return { single: '', all: '' }
  }

  const getTitle = () => {
    if (isInstallment) return 'Deletar Parcela'
    if (isRecurring) return 'Deletar Recorrência'
    return 'Deletar Despesa'
  }

  const getDescription = () => {
    if (showScopeOptions) {
      return 'Escolha se deseja deletar apenas esta despesa ou todas relacionadas:'
    }
    return 'Tem certeza que deseja deletar esta despesa? Esta ação não pode ser desfeita.'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {expense && (
          <div className="py-4 space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Descrição:</span>
                <span className="text-sm font-medium text-foreground">{expense.description || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor:</span>
                <span className="text-sm font-medium text-foreground">
                  R$ {(expense.amount / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Categoria:</span>
                <span className="text-sm font-medium text-foreground">
                  {expense.category.icon} {expense.category.name}
                </span>
              </div>
            </div>

            {showScopeOptions && (
              <RadioGroup
                value={deleteScope}
                onValueChange={(value) => setDeleteScope(value as 'single' | 'all')}
              >
                <div className="flex items-center gap-3 cursor-pointer px-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="single" id="scope-single" />
                  <Label
                    htmlFor="scope-single"
                    className="text-sm flex-1 cursor-pointer py-3"
                  >
                    {getScopeLabel().single}
                  </Label>
                </div>

                <div className="flex items-center gap-3 cursor-pointer px-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="all" id="scope-all" />
                  <Label
                    htmlFor="scope-all"
                    className="text-sm flex-1 cursor-pointer py-3"
                  >
                    {getScopeLabel().all}
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

