import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Wallet } from "lucide-react";
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
import { useCreateMethod } from "../hooks";
import { useGetCards } from "@/modules/card/hooks/useGetCards";
import { createMethodSchema, type CreateMethodFormData } from "../schemas";
import { PAYMENT_METHOD_TYPES } from "../constants";

export default function CreateMethodDialog() {
  const [open, setOpen] = useState(false);

  const { data: cards, isLoading: isLoadingCards } = useGetCards();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateMethodFormData>({
    resolver: zodResolver(createMethodSchema),
  });

  const { mutate: createMethod, isPending } = useCreateMethod(() => {
    setOpen(false);
    reset();
  });

  const selectedType = watch("type");

  const onSubmit = (data: CreateMethodFormData) => {
    const payload = {
      name: data.name,
      type: data.type,
      ...(data.type === "card" && data.card && { card: data.card }),
    };

    createMethod(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Método
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="h-5 w-5" />
            Adicionar Método de Pagamento
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-muted-foreground">Nome do Método *</Label>
            <Input
              id="name"
              placeholder="Ex: Conta Corrente"
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
              onValueChange={(value) => setValue("type", value as "card" | "transfer" | "cash")}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-foreground">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {selectedType === "card" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="card" className="text-muted-foreground">Cartão *</Label>
              <Select
                onValueChange={(value) => setValue("card", value)}
                disabled={isLoadingCards}
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Selecione o cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cards?.map((card) => (
                    <SelectItem key={card._id} value={card._id} className="text-foreground">
                      {card.name} - •••• {card.lastDigits}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {"card" in errors && errors.card && (
                <p className="text-sm text-destructive">{errors.card.message}</p>
              )}
            </div>
          )}

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
              {isPending ? "Criando..." : "Criar Método"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

