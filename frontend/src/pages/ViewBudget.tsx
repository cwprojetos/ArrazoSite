import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Budget } from "@/types/budget";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const ViewBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const logoUrl = "/ArrazoLogo.jpg";

  // Buscar orçamento do backend remoto
  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/orcamento/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Orçamento não encontrado");
        return res.json();
      })
      .then((data: Budget) => setBudget(data))
      .catch(() => {
        toast.error("Orçamento não encontrado");
        navigate("/");
      });
  }, [id, navigate]);

  if (!budget) return null;

  const eventTypeLabels = {
    casamento: "Casamento",
    aniversario: "Aniversário",
    corporativo: "Corporativo",
    outros: "Outros",
  };

  const createPdfBlob = async (): Promise<Blob | null> => {
    if (!printRef.current) return null;
    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvasFn: any = html2canvasModule.default || html2canvasModule;
      const jspdfModule = await import("jspdf");
      const { jsPDF } = jspdfModule as any;

      const canvas = await html2canvasFn(printRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      return pdf.output("blob");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast.error("Erro ao gerar PDF");
      return null;
    }
  };

  const handlePreviewPdf = async () => {
    const blob = await createPdfBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownloadPdf = async () => {
    const blob = await createPdfBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orcamento-${budget.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    const message = `*Orçamento Arazzo Eventos*\n\nCliente: ${budget.clientName}\nEvento: ${eventTypeLabels[budget.eventType]}\nData: ${format(
      new Date(budget.eventDate),
      "dd/MM/yyyy"
    )}\nConvidados: ${budget.guestCount}\n\nValor Total: R$ ${budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <Logo />
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-display mb-2">{budget.clientName}</CardTitle>
            <p className="text-muted-foreground">Orçamento #{budget.id}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações do orçamento */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Tipo de Evento</h3>
                <p>{eventTypeLabels[budget.eventType]}</p>
              </div>
              <div>
                <h3 className="font-semibold">Data</h3>
                <p>{format(new Date(budget.eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
              </div>
              <div>
                <h3 className="font-semibold">Convidados</h3>
                <p>{budget.guestCount}</p>
              </div>
              {budget.location && (
                <div>
                  <h3 className="font-semibold">Local</h3>
                  <p>{budget.location}</p>
                </div>
              )}
            </div>

            {/* Valor total */}
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">Valor Total:</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={handlePreviewPdf}>
                <Eye className="h-5 w-5 mr-2" /> Visualizar PDF
              </Button>
              <Button className="flex-1 shadow-gold" onClick={handleDownloadPdf}>
                <Download className="h-5 w-5 mr-2" /> Baixar PDF
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShareWhatsApp}>
                <Share2 className="h-5 w-5 mr-2" /> WhatsApp
              </Button>
            </div>

            {/* Conteúdo para PDF */}
            <div ref={printRef} style={{ position: "fixed", left: -9999, top: -150, width: 800, background: "#fff", padding: 32, fontFamily: "Arial, sans-serif" }}>
              {/* Mesma estrutura do orçamento */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewBudget;
