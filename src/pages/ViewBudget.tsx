import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { getBudgetById } from "@/lib/storage";
import { Budget } from "@/types/budget";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const ViewBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const logoUrl = "/ArrazoLogo.jpg"; // imagem dentro de /public

  useEffect(() => {
    if (id) {
      const data = getBudgetById(id);
      if (data) setBudget(data);
      else {
        toast.error("Orçamento não encontrado");
        navigate("/");
      }
    }
  }, [id, navigate]);

  if (!budget) return null;

  const eventTypeLabels = {
    casamento: "Casamento",
    aniversario: "Aniversário",
    corporativo: "Corporativo",
    outros: "Outros",
  };

  // Função principal para gerar o PDF
  const createPdfBlob = async (): Promise<Blob | null> => {
    if (!printRef.current) return null;
    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvasFn: any = html2canvasModule.default || html2canvasModule;
      const jspdfModule = await import("jspdf");
      const { jsPDF } = jspdfModule as any;

      const canvas = await html2canvasFn(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

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

  // Visualizar PDF em nova aba (corrige bloqueio)
  const handlePreviewPdf = async () => {
    const blob = await createPdfBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // 🔥 abre em nova aba
  };

  // Baixar PDF
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

  // Compartilhar WhatsApp
  const handleShareWhatsApp = () => {
    const message = `*Orçamento Arazzo Eventos*\n\nCliente: ${budget.clientName}\nEvento: ${eventTypeLabels[budget.eventType]}\nData: ${format(
      new Date(budget.eventDate),
      "dd/MM/yyyy"
    )}\nConvidados: ${budget.guestCount}\n\nValor Total: R$ ${budget.total.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
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
            <CardTitle className="text-3xl font-display mb-2">
              {budget.clientName}
            </CardTitle>
            <p className="text-muted-foreground">Orçamento #{budget.id}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Tipo de Evento</h3>
                <p>{eventTypeLabels[budget.eventType]}</p>
              </div>
              <div>
                <h3 className="font-semibold">Data</h3>
                <p>
                  {format(new Date(budget.eventDate), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
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

            {/* TOTAL */}
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">Valor Total:</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* BOTÕES */}
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

            {/* CONTEÚDO PARA PDF */}
            <div
              ref={printRef}
              style={{
                position: "fixed",
                left: -9999,
                top: -150,
                width: 800,
                background: "#fff",
                padding: 32,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {/* Cabeçalho com logo à esquerda e “Orçamento” centralizado */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  marginTop: -40,
                }}
              >
                <img
                  src={logoUrl}
                  alt="Arazzo Eventos"
                  style={{
                    width: 180,
                    height: "auto",
                    objectFit: "contain",
                  }}
                />

                <div style={{ flex: 1, textAlign: "center" }}>
                  <h1
                    style={{
                      fontSize: 42,
                      fontWeight: 800,
                      color: "#ec4899",
                      margin: 0,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    Orçamento
                  </h1>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#9ca3af",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    Buffet & Casamentos — Arazzo Eventos
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>Nº</strong> {budget.id}
                  </p>
                  <p style={{ margin: 0 }}>
                    {format(new Date(budget.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              {/* SERVIÇOS */}
              <div style={{ marginTop: 20 }}>
                {budget.services
                  .filter((s) => s.selected)
                  .map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 30,
                      }}
                    >
                      {s.image && (
                        <img
                          src={s.image}
                          alt={s.name}
                          crossOrigin="anonymous"
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginRight: 20,
                            border: "2px solid #f3e8ff",
                          }}
                        />
                      )}
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</p>
                        {s.description && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#374151",
                              marginTop: 4,
                              maxWidth: 500,
                            }}
                          >
                            {s.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* TOTAL */}
              <div
                style={{
                  marginTop: 30,
                  textAlign: "right",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#047857",
                }}
              >
                Total: R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>

              {budget.observations && (
                <div style={{ marginTop: 16, fontSize: 12, color: "#374151" }}>
                  <strong>Observações:</strong> {budget.observations}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewBudget;
