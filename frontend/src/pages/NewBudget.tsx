import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { Budget, EventType, BudgetService } from "@/types/budget";
import { toast } from "sonner";

const defaultServices: BudgetService[] = [
  { id: "buffet", name: "Buffet completo", description: "Serviço completo incluindo pratos e garçons", image: "/services/buffet.jpg", selected: false, value: 0 },
  { id: "decoracao", name: "Decoração", description: "Decoração do evento", image: "/services/decoracao.jpg", selected: false, value: 0 },
  { id: "equipe", name: "Equipe de apoio", description: "Equipe de garçons e auxiliares", image: "/services/equipe.jpg", selected: false, value: 0 },
  { id: "iluminacao", name: "Iluminação e Som", description: "Iluminação e sonorização completa", image: "/services/iluminacao.jpg", selected: false, value: 0 },
];

const NewBudget = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState<EventType>("casamento");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [services, setServices] = useState<BudgetService[]>(defaultServices);
  const [discount, setDiscount] = useState<number>(0);
  const [observations, setObservations] = useState("");

  const total = services.filter(s => s.selected).reduce((acc, s) => acc + (Number(s.value) || 0) * guestCount, 0) * ((100 - discount) / 100);

  const handleServiceToggle = (id: string) => setServices(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  const handleServiceValueChange = (id: string, value: number) => setServices(prev => prev.map(s => s.id === id ? { ...s, value } : s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !eventDate) return toast.error("Preencha os campos obrigatórios");

    const budget: Budget = {
      id: Date.now().toString(),
      clientName,
      eventDate,
      eventType,
      location,
      guestCount,
      services,
      pricePerPerson: 0,
      additionalCosts: 0,
      discount,
      observations,
      createdAt: new Date().toISOString(),
      total,
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
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
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
                <h3 className="text-xl font-display font-semibold">Dados do Cliente</h3>
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Digite o nome do cliente" required />
              </div>

              <div>
                <h3 className="text-xl font-display font-semibold mt-4">Dados do Evento</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="eventDate">Data do Evento *</Label>
                    <Input id="eventDate" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                  </div>

                  <div>
                    <Label htmlFor="eventType">Tipo de Evento *</Label>
                    <Select value={eventType} onValueChange={v => setEventType(v as EventType)}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casamento">Casamento</SelectItem>
                        <SelectItem value="aniversario">Aniversário</SelectItem>
                        <SelectItem value="corporativo">Corporativo</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Local (opcional)</Label>
                    <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Local do evento" />
                  </div>

                  <div>
                    <Label htmlFor="guestCount">Número de Convidados *</Label>
                    <Input id="guestCount" type="number" min="0" value={guestCount || ""} onChange={e => setGuestCount(Number(e.target.value))} placeholder="0" required />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-display font-semibold">Serviços</h3>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {services.map(s => (
                    <div key={s.id} className={`border rounded-xl shadow-sm overflow-hidden transition-all ${s.selected ? "border-primary ring-1 ring-primary" : "border-gray-200"}`}>
                      <img src={s.image} alt={s.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{s.name}</h4>
                          <Checkbox checked={s.selected} onCheckedChange={() => handleServiceToggle(s.id)} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                        <Label>Valor por pessoa (R$)</Label>
                        <Input type="number" step="0.01" value={s.value || ""} onChange={e => handleServiceValueChange(s.id, Number(e.target.value))} placeholder="Digite o valor por pessoa" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input id="discount" type="number" min="0" max="100" value={discount || ""} onChange={e => setDiscount(Number(e.target.value))} placeholder="0" />
              </div>

              <div className="bg-secondary p-6 rounded-lg mt-6 flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-3xl font-display font-bold text-primary">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea id="observations" value={observations} onChange={e => setObservations(e.target.value)} placeholder="Informações adicionais..." rows={4} />
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
