import { useCallback } from 'react';
import type { UseFormSetValue, FieldValues, Path } from 'react-hook-form';
import { applyCurrencyMask } from '../lib/currency';

/**
 * Hook para facilitar o uso de inputs de moeda com React Hook Form
 * Aplica máscara automaticamente e mantém o valor formatado
 * 
 * @example
 * const { register, setValue } = useForm();
 * const handleCurrencyChange = useCurrencyInput(setValue, 'amount');
 * 
 * <Input
 *   {...register('amount')}
 *   onChange={handleCurrencyChange}
 * />
 */
export function useCurrencyInput<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  fieldName: Path<T>
) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyCurrencyMask(e.target.value);
      setValue(fieldName, maskedValue as any, { shouldValidate: true });
    },
    [setValue, fieldName]
  );

  return handleChange;
}
