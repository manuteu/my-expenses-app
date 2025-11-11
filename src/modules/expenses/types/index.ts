export type IExpensesResponse = Expense[]
export type IExpensesChartResponse = ExpenseChart[]

export type PaymentMethodType = 'transfer' | 'card' | 'cash';
export type CardType = 'credit' | 'debit';
export type CardFlag = 'visa' | 'mastercard' | 'elo' | 'american-express' | 'other';
export type ExpenseType = 'installment' | 'simple' | 'recurring';

// Tipos para criação de despesas
export interface CreateSimpleExpenseInput {
  amount: number;
  category: string;
  method: string;
  date: string;
  description?: string;
  type: 'simple';
}

export interface CreateInstallmentExpenseInput {
  totalAmount: number;
  installments: number;
  category: string;
  method: string;
  startDate: string;
  description: string;
  type: 'installment';
}

export interface CreateRecurringExpenseInput {
  amount: number;
  category: string;
  method: string;
  startDate: string;
  description: string;
  type: 'recurring';
  monthsToGenerate?: number;
}

export type CreateExpenseInput = 
  | CreateSimpleExpenseInput 
  | CreateInstallmentExpenseInput 
  | CreateRecurringExpenseInput;

interface Card {
  _id: string;
  user: string;
  name: string;
  type: CardType;
  lastDigits: string;
  flag: CardFlag;
  bank: string;
  __v: number;
}

interface PaymentMethod {
  _id: string;
  user: string;
  type: PaymentMethodType;
  name: string;
  card?: Card;
  __v: number;
}

export interface Expense {
  _id: string;
  user: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  description: string;
  installmentGroup?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  type: ExpenseType;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExpenseChart {
  amount: number;
  description: string;
  method: string;
  date: string;
  type: ExpenseType;
  category: string;
}