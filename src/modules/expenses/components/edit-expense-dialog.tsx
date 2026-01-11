import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { DatePicker } from "@/shared/ui/date-picker";
import { useUpdateExpense } from "../hooks";
import { useGetMethod } from "@/modules/method/hooks";
import { useGetCategories } from "@/modules/category/hooks";
import { updateExpenseSchema, type UpdateExpenseFormData } from "../schemas";
import type { Expense, UpdateScope, ExpenseType } from "../types";
import { useCurrencyInput } from "@/shared/hooks/useCurrencyInput";
import { parseCurrencyToCents, formatCentsToInput } from "@/shared/lib/currency";
import UpdateScopeSelector from "./update-scope-selector";

interface EditExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditExpenseDialog({
  expense,
  open,
  onOpenChange,
}: EditExpenseDialogProps) {
  const [updateScope, setUpdateScope] = useState<UpdateScope>('single');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { data: methods, isLoading: isLoadingMethods } = useGetMethod();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateExpenseFormData>({
    resolver: zodResolver(updateExpenseSchema),
  });

  const { mutate: updateExpense, isPending } = useUpdateExpense(() => {
    onOpenChange(false);
    reset();
    setSelectedDate(undefined);
    setUpdateScope('single');
  });

  const selectedType = watch("type") || expense?.type;
  
  // Verifica se está convertendo de tipo
  const isConvertingType = selectedType !== expense?.type;

  // Hooks para aplicar máscara de moeda nos inputs
  const handleAmountChange = useCurrencyInput(setValue, "amount");
  const handleTotalAmountChange = useCurrencyInput(setValue, "totalAmount");

  // Preenche o formulário quando a despesa muda
  useEffect(() => {
    if (expense && open) {
      // Formata valores monetários para exibição (sem símbolo R$)
      const formattedAmount = formatCentsToInput(expense.amount);
      
      setValue("amount", formattedAmount);
      setValue("category", expense.category._id);
      setValue("method", expense.method._id);
      setValue("description", expense.description);
      setValue("type", expense.type as ExpenseType);

      // Define data
      const expenseDate = new Date(expense.date);
      setSelectedDate(expenseDate);
      setValue("date", expenseDate);

      // Campos específicos de parcelada
      if (expense.type === 'installment') {
        // Calcula o valor total baseado no número de parcelas
        const totalAmount = expense.amount * (expense.totalInstallments || 1);
        setValue("totalAmount", formatCentsToInput(totalAmount));
        setValue("installments", expense.totalInstallments?.toString());
      }

      // Reset do scope
      setUpdateScope('single');
    }
  }, [expense, open, setValue]);

  if (!expense) return null;

  const hasGroup = !!expense.installmentGroup;

  const onSubmit = (data: UpdateExpenseFormData) => {
    if (!expense) return;

    // Constrói o payload apenas com os campos que foram alterados
    const payload: any = {
      updateScope: hasGroup ? updateScope : 'single',
    };

    // Adiciona campos comuns se foram modificados
    if (data.amount && data.amount !== formatCentsToInput(expense.amount)) {
      payload.amount = parseCurrencyToCents(data.amount);
    }

    if (data.category && data.category !== expense.category._id) {
      payload.category = data.category;
    }

    if (data.method && data.method !== expense.method._id) {
      payload.method = data.method;
    }

    if (data.description !== expense.description) {
      payload.description = data.description;
    }

    if (data.date) {
      const newDate = data.date.toISOString();
      const oldDate = new Date(expense.date).toISOString();
      if (newDate !== oldDate) {
        payload.date = newDate;
      }
    }

    // Campos específicos de parcelada
    if (expense.type === 'installment' && updateScope === 'all') {
      const installmentData = data as UpdateExpenseFormData & { 
        totalAmount?: string; 
        installments?: string;
        startDate?: Date;
      };
      
      if (installmentData.totalAmount) {
        const totalAmount = parseCurrencyToCents(installmentData.totalAmount);
        const currentTotal = expense.amount * (expense.totalInstallments || 1);
        if (totalAmount !== currentTotal) {
          payload.totalAmount = totalAmount;
        }
      }

      if (installmentData.installments) {
        const newInstallments = parseInt(installmentData.installments);
        if (newInstallments !== expense.totalInstallments) {
          payload.installments = newInstallments;
        }
      }

      if (installmentData.startDate) {
        payload.startDate = installmentData.startDate.toISOString();
      }
    }

    // Campos específicos de recorrente
    if (expense.type === 'recurring') {
      const recurringData = data as UpdateExpenseFormData & { 
        monthsToGenerate?: string;
      };
      
      if (recurringData.monthsToGenerate) {
        payload.monthsToGenerate = parseInt(recurringData.monthsToGenerate);
      }
    }

    // Conversão de tipo
    if (data.type && data.type !== expense.type) {
      payload.type = data.type;
      
      const convertData = data as UpdateExpenseFormData & {
        totalAmount?: string;
        installments?: string;
        amount?: string;
        startDate?: Date;
        monthsToGenerate?: string;
      };
      
      // Validações para conversão
      if (data.type === 'installment') {
        if (!convertData.totalAmount || !convertData.installments) {
          alert('Para converter em parcelada, informe o valor total e número de parcelas');
          return;
        }
        payload.totalAmount = parseCurrencyToCents(convertData.totalAmount);
        payload.installments = parseInt(convertData.installments);
        if (convertData.startDate) {
          payload.startDate = convertData.startDate.toISOString();
        }
      }
      
      if (data.type === 'recurring') {
        if (!convertData.amount) {
          alert('Para converter em recorrente, informe o valor mensal');
          return;
        }
        payload.amount = parseCurrencyToCents(convertData.amount);
        payload.monthsToGenerate = convertData.monthsToGenerate ? parseInt(convertData.monthsToGenerate) : 6;
        if (convertData.startDate) {
          payload.startDate = convertData.startDate.toISOString();
        }
      }
    }

    updateExpense({ expenseId: expense._id, data: payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar Despesa
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Seletor de escopo - só aparece se tiver grupo */}
          <UpdateScopeSelector
            expenseType={expense.type}
            hasGroup={hasGroup}
            value={updateScope}
            onChange={setUpdateScope}
          />

          {/* Tipo - Permite conversão */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="text-muted-foreground">Tipo de Despesa</Label>
            <Select
              onValueChange={(value) => setValue("type", value as ExpenseType)}
              defaultValue={expense.type}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                <SelectItem value="simple">Simples</SelectItem>
                <SelectItem value="installment">Parcelado</SelectItem>
                <SelectItem value="recurring">Recorrente</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-muted-foreground">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Ex: Compra no supermercado"
              className="text-foreground"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="category" className="text-muted-foreground">Categoria</Label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              disabled={isLoadingCategories}
              defaultValue={expense.category._id}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                {categories
                  ?.filter((category) => category.isActive)
                  .map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.icon && `${category.icon} `}{category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Valor - aparece para simple ou recurring */}
          {(selectedType === 'simple' || selectedType === 'recurring') && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount" className="text-muted-foreground">
                {selectedType === 'recurring' ? 'Valor Mensal' : 'Valor'}
                {isConvertingType && selectedType === 'recurring' && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                className="text-foreground"
                {...register("amount")}
                onChange={handleAmountChange}
              />
              {"amount" in errors && errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
          )}

          {/* Campos específicos de parcelada quando updateScope === 'all' OU convertendo para installment */}
          {selectedType === 'installment' && (updateScope === 'all' || isConvertingType) && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="totalAmount" className="text-muted-foreground">
                  Valor Total {isConvertingType && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="totalAmount"
                  type="text"
                  placeholder="0,00"
                  className="text-foreground"
                  {...register("totalAmount")}
                  onChange={handleTotalAmountChange}
                />
                {"totalAmount" in errors && errors.totalAmount && (
                  <p className="text-sm text-destructive">{errors.totalAmount.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="installments" className="text-muted-foreground">
                  Número de Parcelas {isConvertingType && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="installments"
                  type="number"
                  min="2"
                  max="60"
                  placeholder="Ex: 12"
                  className="text-foreground"
                  {...register("installments")}
                />
                {"installments" in errors && errors.installments && (
                  <p className="text-sm text-destructive">{errors.installments.message}</p>
                )}
              </div>
              
              {isConvertingType && (
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  💡 A despesa será convertida em parcelada e novas parcelas serão criadas automaticamente.
                </p>
              )}
            </>
          )}

          {/* Valor para parcela única quando installment e single (e NÃO está convertendo) */}
          {selectedType === 'installment' && updateScope === 'single' && !isConvertingType && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount" className="text-muted-foreground">
                Valor desta Parcela
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                className="text-foreground"
                {...register("amount")}
                onChange={handleAmountChange}
              />
              {"amount" in errors && errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
          )}

          {/* Gerar mais meses - para recorrentes com scope 'all' OU convertendo para recurring */}
          {selectedType === 'recurring' && (updateScope === 'all' || isConvertingType) && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="monthsToGenerate" className="text-muted-foreground">
                {isConvertingType ? 'Meses para Gerar' : 'Gerar Mais Meses'}
              </Label>
              <Input
                id="monthsToGenerate"
                type="number"
                min="1"
                max="12"
                placeholder="Ex: 6"
                defaultValue={isConvertingType ? "6" : undefined}
                className="text-foreground"
                {...register("monthsToGenerate")}
              />
              {"monthsToGenerate" in errors && errors.monthsToGenerate && (
                <p className="text-sm text-destructive">{errors.monthsToGenerate.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {isConvertingType 
                  ? 'Número de meses que serão criados a partir desta despesa' 
                  : 'Adiciona novos meses a partir do último existente'}
              </p>
              
              {isConvertingType && (
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  💡 A despesa será convertida em recorrente e novas ocorrências serão criadas automaticamente.
                </p>
              )}
            </div>
          )}

          {/* Data */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-muted-foreground">Data</Label>
            <DatePicker
              date={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                setValue("date", date as Date);
              }}
              placeholder="Selecione a data"
            />
            {"date" in errors && errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Método de Pagamento */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="method" className="text-muted-foreground">Método de Pagamento</Label>
            <Select
              onValueChange={(value) => setValue("method", value)}
              disabled={isLoadingMethods}
              defaultValue={expense.method._id}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                {methods?.map((method) => (
                  <SelectItem key={method._id} value={method._id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.method && (
              <p className="text-sm text-destructive">{errors.method.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
