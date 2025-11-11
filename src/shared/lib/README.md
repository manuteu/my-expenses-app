# Utilitários de Moeda (Currency)

Utilitários para trabalhar com valores monetários em centavos, seguindo o padrão BRL (Real Brasileiro).

## ⚠️ Importante

A API **sempre trabalha com valores em centavos**:
- `10012` centavos = R$ 100,12
- `5000` centavos = R$ 50,00

## Funções Disponíveis

### `formatCentsToCurrency(cents: number): string`

Converte centavos para string formatada em BRL com símbolo.

```typescript
formatCentsToCurrency(10012)  // "R$ 100,12"
formatCentsToCurrency(5000)   // "R$ 50,00"
```

**Uso:** Para exibir valores em listas, cards, totais, etc.

---

### `formatCentsToInput(cents: number): string`

Converte centavos para string formatada **sem** o símbolo R$.

```typescript
formatCentsToInput(10012)  // "100,12"
formatCentsToInput(5000)   // "50,00"
```

**Uso:** Para preencher inputs com valores existentes (edição).

---

### `parseCurrencyToCents(value: string): number`

Converte string formatada para centavos (inteiro).

```typescript
parseCurrencyToCents("100,12")      // 10012
parseCurrencyToCents("R$ 100,12")   // 10012
parseCurrencyToCents("100.12")      // 10012
```

**Uso:** Antes de enviar valores para a API.

---

### `applyCurrencyMask(value: string): string`

Aplica máscara de moeda BRL em tempo real (para onChange de inputs).

```typescript
applyCurrencyMask("100")     // "1,00"
applyCurrencyMask("1000")    // "10,00"
applyCurrencyMask("10012")   // "100,12"
```

**Uso:** Diretamente no onChange de inputs (ou use o hook `useCurrencyInput`).

---

## Hook: `useCurrencyInput`

Hook para facilitar o uso com React Hook Form.

```typescript
import { useForm } from 'react-hook-form';
import { useCurrencyInput } from '@/shared/hooks/useCurrencyInput';
import { parseCurrencyToCents } from '@/shared/lib/currency';

function MyForm() {
  const { register, setValue } = useForm();
  const handleAmountChange = useCurrencyInput(setValue, 'amount');

  const onSubmit = (data) => {
    const amountInCents = parseCurrencyToCents(data.amount);
    // Envia amountInCents para a API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('amount')}
        onChange={handleAmountChange}
        placeholder="0,00"
      />
    </form>
  );
}
```

---

## Exemplo Completo

### Criar Despesa

```typescript
// No formulário
const handleSubmit = (data) => {
  const payload = {
    amount: parseCurrencyToCents(data.amount), // "100,12" -> 10012
    description: data.description,
  };
  
  createExpense(payload);
};
```

### Listar Despesas

```typescript
// Na listagem
{expenses.map(expense => (
  <div key={expense._id}>
    <span>{expense.description}</span>
    <span>{formatCentsToCurrency(expense.amount)}</span> {/* 10012 -> "R$ 100,12" */}
  </div>
))}
```

---

## Validação com Zod

```typescript
import { z } from 'zod';

const currencyValidator = z.string()
  .min(1, "Valor é obrigatório")
  .refine((val) => {
    const cleaned = val.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0;
  }, "Valor deve ser maior que zero");

const schema = z.object({
  amount: currencyValidator,
});
```

