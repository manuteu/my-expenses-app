import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importPreview, importBatch } from '../services';
import type { ImportBank, ImportStatementType, ImportBatchRequest } from '../types';

export function useImportPreview() {
  return useMutation({
    mutationFn: ({
      bank,
      statementType,
      file,
    }: {
      bank: ImportBank;
      statementType: ImportStatementType;
      file: File;
    }) => importPreview(bank, statementType, file),
  });
}

export function useImportBatch(onSuccess?: (created: number) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ImportBatchRequest) => importBatch(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onSuccess?.(data.created);
    },
  });
}
