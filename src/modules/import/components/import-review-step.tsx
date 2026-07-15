import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, FileSearch, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useGetCategories } from '@/modules/category/hooks';
import { useGetMethod } from '@/modules/method/hooks';
import { importReviewSchema, type ImportReviewFormData } from '../schemas';
import { useImportBatch } from '../hooks';
import type { ImportTransaction } from '../types';
import { formatDateToBR } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';

interface ImportReviewStepProps {
  transactions: ImportTransaction[];
  onBack: () => void;
  onSuccess: (created: number) => void;
}

export default function ImportReviewStep({
  transactions,
  onBack,
  onSuccess,
}: ImportReviewStepProps) {
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const { data: methods, isLoading: loadingMethods } = useGetMethod();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ImportReviewFormData>({
    resolver: zodResolver(importReviewSchema),
    defaultValues: {
      expenses: transactions.map((t) => ({
        date: t.date,
        amount: t.amount,
        description: t.description,
        category: '',
        method: '',
      })),
    },
  });

  const { fields, remove } = useFieldArray({ control, name: 'expenses' });

  const { mutate: batchImport, isPending, error } = useImportBatch();

  const onSubmit = (data: ImportReviewFormData) => {
    const expenses = data.expenses.map((e) => ({
      ...e,
      amount: Math.round(e.amount * 100),
    }));
    batchImport(
      { expenses },
      { onSuccess: (res) => onSuccess(res.created) },
    );
  };

  const errorMessage = error
    ? ((error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao importar as despesas')
    : null;

  const totalAmount = fields.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-5">
      {/* Resumo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <FileSearch className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {fields.length}{' '}
            {fields.length === 1 ? 'transação' : 'transações'}
          </span>
          {fields.length !== transactions.length && (
            <span className="text-muted-foreground/70 text-xs">
              ({transactions.length - fields.length} removida{transactions.length - fields.length === 1 ? '' : 's'})
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Total:{' '}
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalAmount)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Preencha <span className="font-medium text-foreground">categoria</span> e{' '}
        <span className="font-medium text-foreground">método de pagamento</span> para todas as
        transações antes de confirmar a importação.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tabela editável */}
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto bg-background">
            <div className="max-h-[420px] overflow-y-auto bg-background">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-[100px]">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-[120px]">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[180px]">
                      Descrição
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-[190px]">
                      Categoria <span className="text-destructive">*</span>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-[190px]">
                      Método <span className="text-destructive">*</span>
                    </th>
                    <th className="px-4 py-3 w-[48px]" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {fields.map((field, index) => {
                    const categoryError = errors.expenses?.[index]?.category;
                    const methodError = errors.expenses?.[index]?.method;

                    return (
                      <tr
                        key={field.id}
                        className="bg-background hover:bg-muted/30 transition-colors"
                      >
                        {/* Data */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                          {formatDateToBR(field.date)}
                        </td>

                        {/* Valor */}
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap text-xs">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(field.amount / 100)}
                        </td>

                        {/* Descrição editável */}
                        <td className="px-4 py-3">
                          <Input
                            {...register(`expenses.${index}.description`)}
                            className="h-8 text-xs text-foreground min-w-[160px]"
                            placeholder="Descrição (opcional)"
                          />
                        </td>

                        {/* Categoria */}
                        <td className="px-4 py-3">
                          <Controller
                            control={control}
                            name={`expenses.${index}.category`}
                            render={({ field: f }) => (
                              <div className="space-y-1">
                                <Select
                                  onValueChange={f.onChange}
                                  value={f.value}
                                  disabled={loadingCategories}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      'h-8 text-xs',
                                      categoryError && 'border-destructive focus:ring-destructive',
                                    )}
                                  >
                                    <SelectValue placeholder="Selecionar" />
                                  </SelectTrigger>
                                  <SelectContent className="text-foreground">
                                    {categories
                                      ?.filter((c) => c.isActive)
                                      .map((category) => (
                                        <SelectItem
                                          key={category._id}
                                          value={category._id}
                                        >
                                          {category.icon && `${category.icon} `}
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                {categoryError && (
                                  <p className="text-xs text-destructive">
                                    {categoryError.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </td>

                        {/* Método */}
                        <td className="px-4 py-3">
                          <Controller
                            control={control}
                            name={`expenses.${index}.method`}
                            render={({ field: f }) => (
                              <div className="space-y-1">
                                <Select
                                  onValueChange={f.onChange}
                                  value={f.value}
                                  disabled={loadingMethods}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      'h-8 text-xs',
                                      methodError && 'border-destructive focus:ring-destructive',
                                    )}
                                  >
                                    <SelectValue placeholder="Selecionar" />
                                  </SelectTrigger>
                                  <SelectContent className="text-foreground">
                                    {methods?.map((method) => (
                                      <SelectItem
                                        key={method._id}
                                        value={method._id}
                                      >
                                        {method.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {methodError && (
                                  <p className="text-xs text-destructive">
                                    {methodError.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </td>

                        {/* Remover */}
                        <td className="px-2 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remover transação"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isPending}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" disabled={isPending || fields.length === 0} className="flex-1">
            {isPending
              ? 'Importando...'
              : `Importar ${fields.length} despesa${fields.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
