import { Budget } from "@/types/budget";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: string) => void;
}

export const BudgetCard = ({ budget, onDelete }: BudgetCardProps) => {
  const navigate = useNavigate();
  
  const eventTypeLabels = {
    casamento: "Casamento",
    aniversario: "Aniversário",
    corporativo: "Corporativo",
    outros: "Outros",
  };

  return (
    <Card className="hover:shadow-gold transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-display font-semibold text-foreground">
              {budget.clientName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {eventTypeLabels[budget.eventType]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(budget.eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{budget.guestCount} convidados</span>
        </div>
        
        {budget.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{budget.location}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/orcamento/${budget.id}`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/editar/${budget.id}`)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(budget.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
