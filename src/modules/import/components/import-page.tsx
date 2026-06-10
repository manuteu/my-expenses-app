import { useState } from 'react';
import { FileUp, ListChecks, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import ImportUploadStep from './import-upload-step';
import ImportReviewStep from './import-review-step';
import ImportSuccessStep from './import-success-step';
import type { ImportTransaction } from '../types';

type Step = 'upload' | 'review' | 'success';

const steps: { id: Step; label: string; icon: React.ElementType; step: number }[] = [
  { id: 'upload', label: 'Upload', icon: FileUp, step: 1 },
  { id: 'review', label: 'Revisão', icon: ListChecks, step: 2 },
  { id: 'success', label: 'Concluído', icon: CheckCircle2, step: 3 },
];

const stepContent: Record<Step, { title: string; description: string }> = {
  upload: {
    title: 'Importar Despesas via CSV',
    description:
      'Selecione o banco, o tipo de extrato e envie o arquivo CSV para processar.',
  },
  review: {
    title: 'Revisar Transações',
    description:
      'Confira as transações encontradas e atribua categoria e método para cada uma.',
  },
  success: {
    title: 'Importação Concluída',
    description: 'Suas despesas foram importadas com sucesso.',
  },
};

export default function ImportPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [transactions, setTransactions] = useState<ImportTransaction[]>([]);
  const [createdCount, setCreatedCount] = useState(0);

  const handleUploadSuccess = (txns: ImportTransaction[]) => {
    setTransactions(txns);
    setCurrentStep('review');
  };

  const handleBatchSuccess = (created: number) => {
    setCreatedCount(created);
    setCurrentStep('success');
  };

  const handleReset = () => {
    setTransactions([]);
    setCreatedCount(0);
    setCurrentStep('upload');
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="mx-auto space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Importação CSV</h1>
        <p className="mt-1 text-muted-foreground">
          Importe despesas do seu extrato bancário ou fatura de cartão
        </p>
      </div>

      {/* Indicador de etapas */}
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive &&
                    'bg-primary/10 text-primary ring-1 ring-primary/50',
                  !isCompleted &&
                    !isActive &&
                    'text-muted-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:block">{step.label}</span>
                <span className="sm:hidden text-xs font-semibold">{step.step}</span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-px w-8 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            {stepContent[currentStep].title}
          </CardTitle>
          <CardDescription>{stepContent[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'upload' && (
            <ImportUploadStep onSuccess={handleUploadSuccess} />
          )}
          {currentStep === 'review' && (
            <ImportReviewStep
              transactions={transactions}
              onBack={() => setCurrentStep('upload')}
              onSuccess={handleBatchSuccess}
            />
          )}
          {currentStep === 'success' && (
            <ImportSuccessStep
              created={createdCount}
              onImportMore={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
