import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';
import { importUploadSchema, type ImportUploadFormData } from '../schemas';
import { useImportPreview } from '../hooks';
import type { ImportTransaction } from '../types';

interface ImportUploadStepProps {
  onSuccess: (transactions: ImportTransaction[]) => void;
}

export default function ImportUploadStep({ onSuccess }: ImportUploadStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ImportUploadFormData>({
    resolver: zodResolver(importUploadSchema),
  });

  const { mutate: previewCsv, isPending, error } = useImportPreview();

  const handleFileChange = (file: File | null) => {
    if (file && !file.name.endsWith('.csv')) return;
    setSelectedFile(file);
    if (file) setValue('file', file);
  };

  const onSubmit = (data: ImportUploadFormData) => {
    previewCsv(
      { bank: data.bank, statementType: data.statementType, file: data.file },
      { onSuccess: (res) => onSuccess(res.transactions) },
    );
  };

  const errorMessage = error
    ? ((error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao processar o arquivo CSV')
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Banco */}
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Banco *</Label>
          <Select onValueChange={(value) => setValue('bank', value as 'nubank')}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Selecione o banco" />
            </SelectTrigger>
            <SelectContent className="text-foreground">
              <SelectItem value="nubank">Nubank</SelectItem>
            </SelectContent>
          </Select>
          {errors.bank && (
            <p className="text-sm text-destructive">{errors.bank.message}</p>
          )}
        </div>

        {/* Tipo de extrato */}
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Tipo de Extrato *</Label>
          <Select
            onValueChange={(value) =>
              setValue('statementType', value as 'extrato' | 'fatura')
            }
          >
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="text-foreground">
              <SelectItem value="extrato">Extrato da Conta</SelectItem>
              <SelectItem value="fatura">Fatura do Cartão</SelectItem>
            </SelectContent>
          </Select>
          {errors.statementType && (
            <p className="text-sm text-destructive">
              {errors.statementType.message}
            </p>
          )}
        </div>
      </div>

      {/* Upload de arquivo */}
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Arquivo CSV *</Label>
        <div
          role="button"
          tabIndex={0}
          aria-label="Área de upload de arquivo CSV"
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer outline-none',
            isDragging && 'border-primary bg-primary/5',
            selectedFile && !isDragging && 'border-primary/50 bg-primary/5',
            !selectedFile && !isDragging && 'border-border hover:border-primary/50 hover:bg-muted/30',
          )}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            handleFileChange(file ?? null);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {selectedFile ? (
            <div className="flex items-center gap-4">
              <FileText className="h-10 w-10 shrink-0 text-primary" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                aria-label="Remover arquivo"
                className="ml-2 rounded-full p-1.5 hover:bg-muted transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Clique ou arraste o arquivo aqui
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Apenas arquivos .csv
              </p>
            </>
          )}
        </div>
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message}</p>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Processando...' : 'Processar CSV'}
      </Button>
    </form>
  );
}
