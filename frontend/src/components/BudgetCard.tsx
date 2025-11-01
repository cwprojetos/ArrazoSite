import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Budget } from "@/types/budget";

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: string) => void;
}

export const BudgetCard = ({ budget, onDelete }: BudgetCardProps) => {
  return (
    <Card className="shadow-sm border hover:shadow-lg transition-all">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{budget.clientName}</h3>
          <Button variant="destructive" size="sm" onClick={() => onDelete(budget.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Evento: {budget.eventType}</p>
        <p className="text-sm text-muted-foreground mb-1">Convidados: {budget.guestCount}</p>
        <p className="text-sm text-muted-foreground">Total: R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      </CardContent>
    </Card>
  );
};
