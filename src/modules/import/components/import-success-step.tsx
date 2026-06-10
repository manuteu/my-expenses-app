import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useNavigate } from 'react-router';

interface ImportSuccessStepProps {
  created: number;
  onImportMore: () => void;
}

export default function ImportSuccessStep({
  created,
  onImportMore,
}: ImportSuccessStepProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Importação concluída!
        </h2>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{created}</span>{' '}
          despesa{created === 1 ? '' : 's'}{' '}
          {created === 1 ? 'foi criada' : 'foram criadas'} com sucesso.
        </p>
        <p className="text-sm text-muted-foreground">
          As despesas já estão disponíveis na sua lista.
        </p>
      </div>

      <div className="flex w-full max-w-sm gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onImportMore}
        >
          <RotateCcw className="h-4 w-4" />
          Importar mais
        </Button>
        <Button className="flex-1" onClick={() => navigate('/expenses')}>
          Ver despesas
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
