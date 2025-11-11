import { Wallet } from "lucide-react";
import { useGetMethod } from "../hooks";
import CreateMethodDialog from "./create-method-dialog";
import { PAYMENT_METHOD_ICONS, PAYMENT_METHOD_COLORS } from "../constants";

export default function ListMethods() {
  const { data, isLoading } = useGetMethod();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Métodos de Pagamento</h2>
        <CreateMethodDialog />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Carregando métodos...</p>
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <Wallet className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum método cadastrado</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((method) => (
            <div
              key={method._id}
              className="relative p-6 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-200"
            >
              {/* Background gradiente */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${PAYMENT_METHOD_COLORS[method.type] || "from-gray-500 to-gray-600"
                  } opacity-90`}
              ></div>

              {/* Overlay para melhor contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

              {/* Conteúdo */}
              <div className="relative z-10 text-white">
                {/* Ícone do tipo */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl">
                    {PAYMENT_METHOD_ICONS[method.type] || "💰"}
                  </div>
                  <span className="text-xs font-bold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-sm capitalize">
                    {method.type === "card" && "Cartão"}
                    {method.type === "transfer" && "Transferência"}
                    {method.type === "cash" && "Dinheiro"}
                  </span>
                </div>

                {/* Nome do método */}
                <div className="mb-4">
                  <p className="text-xs font-medium mb-1 text-white/70">Nome do Método</p>
                  <h3 className="text-xl font-bold drop-shadow-md">{method.name}</h3>
                </div>

                {/* Informações do cartão (se aplicável) */}
                {method.card && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs font-medium mb-1 text-white/70">Cartão Vinculado</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm drop-shadow-md">
                        {method.card.name}
                      </p>
                      <p className="font-mono text-sm drop-shadow-md">
                        •••• {method.card.lastDigits}
                      </p>
                    </div>
                    <p className="text-xs text-white/80 mt-1 capitalize">
                      {method.card.flag} • {method.card.type === "credit" ? "Crédito" : "Débito"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
