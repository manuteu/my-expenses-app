/**
 * Utilitários para trabalhar com valores monetários em centavos
 * A API sempre trabalha com valores em centavos (ex: 10012 = R$ 100,12)
 */

/**
 * Converte centavos para reais formatado em BRL
 * @param cents - Valor em centavos
 * @returns String formatada em BRL (ex: "R$ 100,12")
 */
export function formatCentsToCurrency(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(reais);
}

/**
 * Converte centavos para string formatada sem o símbolo R$
 * Útil para inputs
 * @param cents - Valor em centavos
 * @returns String formatada (ex: "100,12")
 */
export function formatCentsToInput(cents: number): string {
  const reais = cents / 100;
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converte string formatada para centavos
 * Remove formatação e converte para número inteiro em centavos
 * @param value - String formatada (ex: "100,12" ou "R$ 100,12" ou "100.12")
 * @returns Valor em centavos
 */
export function parseCurrencyToCents(value: string): number {
  if (!value) return 0;
  
  // Remove tudo exceto números, vírgula e ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  
  // Substitui vírgula por ponto para parseFloat
  const normalized = cleaned.replace(',', '.');
  
  const reais = parseFloat(normalized) || 0;
  
  // Converte para centavos e arredonda
  return Math.round(reais * 100);
}

/**
 * Aplica máscara de moeda BRL em tempo real
 * Para ser usado em onChange de inputs
 * @param value - Valor digitado
 * @returns String formatada com máscara
 */
export function applyCurrencyMask(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para número e divide por 100 para ter centavos
  const amount = parseInt(numbers) / 100;
  
  // Formata em BRL sem o símbolo
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

