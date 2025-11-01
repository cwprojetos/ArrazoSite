import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { BudgetCard } from "@/components/BudgetCard";
import { Budget } from "@/types/budget";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [serverStatus, setServerStatus] = useState("Carregando...");

  // Carregar orçamentos do backend
  const loadBudgets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orcamento`);
      if (!res.ok) throw new Error("Erro ao buscar orçamentos");
      const data: Budget[] = await res.json();
      setBudgets(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível carregar os orçamentos");
      setBudgets([]);
    }
  };

  // Checar status do servidor
  const checkServer = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ping`);
      const data = await res.json();
      setServerStatus(data.message);
    } catch (err) {
      console.error(err);
      setServerStatus("Erro ao conectar ❌");
    }
  };

  useEffect(() => {
    checkServer();
    loadBudgets();
  }, []);

  // Excluir orçamento
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orcamento/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir orçamento");
      toast.success("Orçamento excluído com sucesso");
      loadBudgets();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível excluir o orçamento");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Logo />
        </div>

        {/* Status do servidor */}
        <div className="bg-muted p-3 rounded-md mb-6 text-center">
          <p>
            <strong>Status do servidor:</strong> {serverStatus}
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              Meus Orçamentos
            </h2>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os orçamentos criados
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/novo-orcamento")}
            className="shadow-gold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-secondary/50 rounded-full p-6 mb-6">
              <FileText className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-2">
              Nenhum orçamento criado
            </h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Comece criando seu primeiro orçamento personalizado para seus clientes
            </p>
            <Button size="lg" onClick={() => navigate("/novo-orcamento")}>
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeiro Orçamento
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
