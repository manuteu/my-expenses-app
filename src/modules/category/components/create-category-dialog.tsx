import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Tags } from "lucide-react";
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
import { createCategorySchema, type CreateCategoryFormData } from "../schemas";
import { useCreateCategory } from "../hooks";

export default function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const { mutate: createCategory, isPending } = useCreateCategory(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (data: CreateCategoryFormData) => {
    createCategory(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Tags className="h-5 w-5" />
            Adicionar Categoria
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-muted-foreground">
              Nome da Categoria *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Alimentação"
              className="text-foreground"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="icon" className="text-muted-foreground">
              Ícone (opcional)
            </Label>
            <Input
              id="icon"
              placeholder="Ex: 🍔"
              className="text-foreground"
              {...register("icon")}
            />
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="color" className="text-muted-foreground">
              Cor HEX (opcional)
            </Label>
            <Input
              id="color"
              placeholder="Ex: #FF5733"
              className="text-foreground"
              {...register("color")}
            />
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
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
              {isPending ? "Criando..." : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
