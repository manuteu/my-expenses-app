import { api } from '@/app/config/axios';
import type {
  ImportBank,
  ImportStatementType,
  ImportPreviewResponse,
  ImportBatchRequest,
  ImportBatchResponse,
} from '../types';

export const importPreview = async (
  bank: ImportBank,
  statementType: ImportStatementType,
  file: File,
): Promise<ImportPreviewResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<ImportPreviewResponse>(
    `/import/preview?bank=${bank}&statementType=${statementType}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};

export const importBatch = async (
  data: ImportBatchRequest,
): Promise<ImportBatchResponse> => {
  const response = await api.post<ImportBatchResponse>('/import/batch', data);
  return response.data;
};
