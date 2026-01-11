import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import type { ExpenseType, UpdateScope } from "../types";

interface UpdateScopeSelectorProps {
  expenseType: ExpenseType;
  hasGroup: boolean;
  value: UpdateScope;
  onChange: (value: UpdateScope) => void;
}

export default function UpdateScopeSelector({
  expenseType,
  hasGroup,
  value,
  onChange,
}: UpdateScopeSelectorProps) {
  // Se não tiver grupo, não mostra as opções
  if (!hasGroup) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">🔗 Esta despesa faz parte de um grupo</span>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">
          Deseja atualizar:
        </Label>
        
        <RadioGroup value={value} onValueChange={onChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="cursor-pointer font-normal">
              Apenas esta despesa
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer font-normal">
              {expenseType === 'installment' 
                ? 'Todas as parcelas deste grupo' 
                : 'Todas as recorrências deste grupo'}
            </Label>
          </div>
          
          {expenseType === 'recurring' && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="future" id="future" />
              <Label htmlFor="future" className="cursor-pointer font-normal">
                Esta e as recorrências futuras
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>
      
      {value === 'all' && (
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
          ⚠️ Atenção: Esta ação afetará {expenseType === 'installment' ? 'todas as parcelas' : 'todas as recorrências'} do grupo.
        </p>
      )}
      
      {value === 'future' && expenseType === 'recurring' && (
        <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
          ℹ️ As recorrências passadas manterão seus valores originais.
        </p>
      )}
    </div>
  );
}
