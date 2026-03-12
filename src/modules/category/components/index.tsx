import { Tags } from "lucide-react";
import { useGetCategories } from "../hooks";
import CreateCategoryDialog from "./create-category-dialog";

export default function ListCategories() {
  const { data, isLoading } = useGetCategories();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Categorias</h2>
        <CreateCategoryDialog />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <Tags className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((category) => (
            <div
              key={category._id}
              className="border border-border bg-card rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: category.color || "#64748B" }}
                />
                <span className="text-2xl leading-none">{category.icon || "🏷️"}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.isActive ? "Ativa" : "Inativa"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
