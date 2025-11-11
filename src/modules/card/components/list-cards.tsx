import { CreditCard } from "lucide-react";
import { useGetCards } from "../hooks/useGetCards";
import CreateCardDialog from "./create-card-dialog";
import { CARD_FLAG_LABELS, CARD_TYPE_LABELS, CARD_COLORS } from "../constants";

export default function ListCard() {
  const { data, isLoading } = useGetCards();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Cartões</h2>
        <CreateCardDialog />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Carregando cartões...</p>
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum cartão cadastrado</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((card) => (
            <div
              key={card._id}
              className={`relative p-6 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-200`}
            >
              {/* Background gradiente */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                CARD_COLORS[card.flag] || CARD_COLORS.other
              } opacity-90`}></div>
              
              {/* Overlay para melhor contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
              
              {/* Conteúdo */}
              <div className="relative z-10 text-white">
                {/* Chip do cartão */}
                <div className="absolute top-0 left-0 w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-md"></div>

                {/* Tipo do cartão */}
                <div className="flex justify-end mb-8">
                  <span className="text-xs font-bold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-sm">
                    {CARD_TYPE_LABELS[card.type] || card.type}
                  </span>
                </div>

                {/* Número do cartão (últimos dígitos) */}
                <div className="mb-6 mt-4">
                  <p className="text-xl font-mono tracking-widest drop-shadow-lg">
                    •••• •••• •••• {card.lastDigits}
                  </p>
                </div>

                {/* Nome e Banco */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-medium mb-1 text-white/70">Nome</p>
                    <p className="font-bold text-sm drop-shadow-md">{card.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium mb-1 text-white/70">Banco</p>
                    <p className="font-bold text-sm capitalize drop-shadow-md">{card.bank}</p>
                  </div>
                </div>

                {/* Bandeira */}
                <div className="absolute bottom-4 right-6">
                  <p className="text-xs font-bold uppercase drop-shadow-lg tracking-wider">
                    {CARD_FLAG_LABELS[card.flag] || card.flag}
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
