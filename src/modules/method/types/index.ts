export type IMethodResponse = PaymentMethod[]

type PaymentMethodType = 'transfer' | 'card';

type CardType = 'credit' | 'debit';
type CardFlag = 'mastercard' | 'visa' | string;

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