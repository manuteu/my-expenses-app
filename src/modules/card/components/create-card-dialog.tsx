import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useCreateCard } from "../hooks/useGetCards";
import { createCardSchema, type CreateCardFormData } from "../schemas";
import { CARD_FLAGS, CARD_FLAG_LABELS } from "../constants";

export default function CreateCardDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
  });

  const { mutate: createCard, isPending } = useCreateCard(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (data: CreateCardFormData) => {
    createCard(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5" />
            Adicionar Novo Cartão
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-muted-foreground">Nome do Cartão *</Label>
            <Input
              id="name"
              placeholder="Ex: Cartão Principal"
              className="text-foreground"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="text-muted-foreground">Tipo *</Label>
            <Select
              onValueChange={(value) => setValue("type", value as "credit" | "debit")}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                <SelectItem value="credit">Crédito</SelectItem>
                <SelectItem value="debit">Débito</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="flag" className="text-muted-foreground">Bandeira *</Label>
            <Select onValueChange={(value) => setValue("flag", value)}>
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione a bandeira" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                {CARD_FLAGS.map((flag) => (
                  <SelectItem key={flag} value={flag}>
                    {CARD_FLAG_LABELS[flag]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.flag && (
              <p className="text-sm text-destructive">{errors.flag.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bank" className="text-muted-foreground">Banco *</Label>
            <Input
              id="bank"
              placeholder="Ex: Nubank"
              className="text-foreground"
              {...register("bank")}
            />
            {errors.bank && (
              <p className="text-sm text-destructive">{errors.bank.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lastDigits" className="text-muted-foreground">4 Últimos Dígitos *</Label>
            <Input
              id="lastDigits"
              placeholder="1234"
              maxLength={4}
              className="text-foreground"
              {...register("lastDigits")}
            />
            {errors.lastDigits && (
              <p className="text-sm text-destructive">{errors.lastDigits.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Criando..." : "Criar Cartão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

