// src/pages/NewBudget.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const NewBudget = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("casamento");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [observations, setObservations] = useState("");
  const [total, setTotal] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !eventDate || !guestCount) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const budget = {
      cliente_nome: clientName,
      evento_tipo: eventType,
      data_evento: eventDate,
      local_evento: location,
      convidados: guestCount,
      total,
      observacoes,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orcamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });

      if (!res.ok) throw new Error("Erro ao salvar orçamento");

      toast.success("Orçamento salvo com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar o orçamento");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <Logo />
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-display">Novo Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventDate">Data do Evento *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="guestCount">Número de Convidados *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min={1}
                  value={guestCount || ""}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-4 shadow-gold">
                <Save className="h-5 w-5 mr-2" /> Salvar Orçamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewBudget;
