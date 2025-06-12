export type IExpensesResponse = Expense[]

type PaymentMethodType = 'transfer' | 'card';

interface PaymentMethod {
  _id: string;
  user: string;
  type: PaymentMethodType;
  name: string;
  __v: number;
}

interface Expense {
  _id: string;
  user: string;
  amount: number;
  category: string;
  method: PaymentMethod;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
