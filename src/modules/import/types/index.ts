export type ImportBank = 'nubank';
export type ImportStatementType = 'extrato' | 'fatura';

export interface ImportTransaction {
  date: string;
  amount: number;
  description: string;
}

export interface ImportPreviewResponse {
  transactions: ImportTransaction[];
}

export interface ImportBatchExpense {
  date: string;
  amount: number;
  description?: string;
  category: string;
  method: string;
}

export interface ImportBatchRequest {
  expenses: ImportBatchExpense[];
}

export interface ImportBatchResponse {
  created: number;
}
