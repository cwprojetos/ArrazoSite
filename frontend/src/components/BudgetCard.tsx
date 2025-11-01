// src/components/BudgetCard.tsx
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Budget } from "@/types/budget";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: number | string) => void;
}

export const BudgetCard: FC<BudgetCardProps> = ({ budget, onDelete }) => {
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{budget.cliente_nome}</CardTitle>
        <p className="text-muted-foreground text-sm">
          Orçamento #{budget.id} — {format(new Date(budget.criado_em), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Evento:</strong> {budget.evento_tipo}
        </p>
        <p>
          <strong>Data:</strong> {budget.data_evento}
        </p>
        <p>
          <strong>Local:</strong> {budget.local_evento || "Não informado"}
        </p>
        <p>
          <strong>Convidados:</strong> {budget.convidados}
        </p>
        <p>
          <strong>Total:</strong> R$ {Number(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>

        {budget.observacoes && (
          <p>
            <strong>Observações:</strong> {budget.observacoes}
          </p>
        )}

        <Button
          variant="destructive"
          size="sm"
          className="mt-2"
          onClick={() => onDelete(budget.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </CardContent>
    </Card>
  );
};
