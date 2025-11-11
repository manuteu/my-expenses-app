import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateExpense } from "../hooks";
import { useGetMethod } from "@/modules/method/hooks";
import { useGetCategories } from "@/modules/category/hooks";
import { createExpenseSchema, type CreateExpenseFormData } from "../schemas";
import type { ExpenseType } from "../types";
import { useCurrencyInput } from "@/shared/hooks/useCurrencyInput";
import { parseCurrencyToCents } from "@/shared/lib/currency";

export default function CreateExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  
  const { data: methods, isLoading: isLoadingMethods } = useGetMethod();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      type: "simple",
    },
  });

  const { mutate: createExpense, isPending } = useCreateExpense(() => {
    setOpen(false);
    reset();
    setSelectedDate(undefined);
    setSelectedStartDate(undefined);
  });

  const selectedType = watch("type");

  // Hooks para aplicar máscara de moeda nos inputs
  const handleAmountChange = useCurrencyInput(setValue, "amount");
  const handleTotalAmountChange = useCurrencyInput(setValue, "totalAmount");

  const onSubmit = (data: CreateExpenseFormData) => {
    let payload;

    if (data.type === "simple") {
      if (!data.date) return;
      payload = {
        amount: parseCurrencyToCents(data.amount), // Converte para centavos
        category: data.category,
        method: data.method,
        date: data.date.toISOString(),
        description: data.description,
        type: "simple" as const,
      };
    } else if (data.type === "installment") {
      if (!data.startDate) return;
      payload = {
        totalAmount: parseCurrencyToCents(data.totalAmount), // Converte para centavos
        installments: parseInt(data.installments),
        category: data.category,
        method: data.method,
        startDate: data.startDate.toISOString(),
        description: data.description,
        type: "installment" as const,
      };
    } else {
      if (!data.startDate) return;
      payload = {
        amount: parseCurrencyToCents(data.amount), // Converte para centavos
        category: data.category,
        method: data.method,
        startDate: data.startDate.toISOString(),
        description: data.description,
        type: "recurring" as const,
        monthsToGenerate: data.monthsToGenerate ? parseInt(data.monthsToGenerate) : 6,
      };
    }

    createExpense(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Criar Nova Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tipo - Primeiro campo para mudar dinamicamente o formulário */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="text-muted-foreground">Tipo de Despesa</Label>
            <Select
              onValueChange={(value) => setValue("type", value as ExpenseType)}
              defaultValue="simple"
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
              Descrição {selectedType !== "simple" && <span className="text-destructive">*</span>}
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
            <Label htmlFor="category" className="text-muted-foreground">Categoria *</Label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              disabled={isLoadingCategories}
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

          {/* Campos específicos por tipo */}
          {selectedType === "simple" && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-muted-foreground">Valor *</Label>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-muted-foreground">Data *</Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={(date) => {
                    setSelectedDate(date);
                    setValue("date", date as Date);
                  }}
                  placeholder="Selecione data e hora"
                />
                {"date" in errors && errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>
            </>
          )}

          {selectedType === "installment" && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="totalAmount" className="text-muted-foreground">Valor Total *</Label>
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
                <Label htmlFor="installments" className="text-muted-foreground">Número de Parcelas *</Label>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate" className="text-muted-foreground">Data da Primeira Parcela *</Label>
                <DatePicker
                  date={selectedStartDate}
                  onDateChange={(date) => {
                    setSelectedStartDate(date);
                    setValue("startDate", date as Date);
                  }}
                  placeholder="Selecione data e hora"
                />
                {"startDate" in errors && errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>
            </>
          )}

          {selectedType === "recurring" && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-muted-foreground">Valor por Recorrência *</Label>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate" className="text-muted-foreground">Data da Primeira Ocorrência *</Label>
                <DatePicker
                  date={selectedStartDate}
                  onDateChange={(date) => {
                    setSelectedStartDate(date);
                    setValue("startDate", date as Date);
                  }}
                  placeholder="Selecione uma data"
                />
                {"startDate" in errors && errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="monthsToGenerate" className="text-muted-foreground">Meses a Gerar (Padrão: 6)</Label>
                <Input
                  id="monthsToGenerate"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="6"
                  className="text-foreground"
                  {...register("monthsToGenerate")}
                />
                {"monthsToGenerate" in errors && errors.monthsToGenerate && (
                  <p className="text-sm text-destructive">{errors.monthsToGenerate.message}</p>
                )}
              </div>
            </>
          )}

          {/* Método de Pagamento - comum a todos */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="method" className="text-muted-foreground">Método de Pagamento *</Label>
            <Select
              onValueChange={(value) => setValue("method", value)}
              disabled={isLoadingMethods}
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
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Criando..." : "Criar Despesa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

