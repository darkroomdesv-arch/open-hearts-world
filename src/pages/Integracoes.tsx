import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Clock, Bell, Settings2, Zap, CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface MensagemTemplate {
  id: number;
  nome: string;
  tipo: "lembrete" | "confirmacao" | "pos-consulta" | "aniversario";
  mensagem: string;
  antecedencia: string;
  ativo: boolean;
}

const templatesMock: MensagemTemplate[] = [
  {
    id: 1,
    nome: "Lembrete 24h antes",
    tipo: "lembrete",
    mensagem: "Olá {nome}! 😊 Lembramos que sua consulta na DentaClin está marcada para amanhã, {data} às {hora}. Procedimento: {procedimento}. Confirme respondendo SIM. Precisando remarcar, ligue: (11) 3000-0000.",
    antecedencia: "24h",
    ativo: true,
  },
  {
    id: 2,
    nome: "Lembrete 2h antes",
    tipo: "lembrete",
    mensagem: "Olá {nome}! Sua consulta é HOJE às {hora} na DentaClin. Estamos te esperando! 🦷",
    antecedencia: "2h",
    ativo: true,
  },
  {
    id: 3,
    nome: "Confirmação de agendamento",
    tipo: "confirmacao",
    mensagem: "Olá {nome}! Seu agendamento na DentaClin foi confirmado ✅\n📅 {data} às {hora}\n🦷 {procedimento}\nQualquer dúvida, estamos à disposição!",
    antecedencia: "imediato",
    ativo: true,
  },
  {
    id: 4,
    nome: "Pós-consulta",
    tipo: "pos-consulta",
    mensagem: "Olá {nome}! Esperamos que tudo tenha ido bem na sua consulta de hoje. Lembre-se de seguir as orientações do seu dentista. Qualquer dúvida, entre em contato! 💙",
    antecedencia: "2h depois",
    ativo: false,
  },
  {
    id: 5,
    nome: "Aniversário",
    tipo: "aniversario",
    mensagem: "Feliz aniversário, {nome}! 🎂🎉 A equipe DentaClin deseja um dia incrível! Aproveite 10% de desconto em qualquer procedimento este mês. Agende: (11) 3000-0000.",
    antecedencia: "no dia",
    ativo: false,
  },
];

const tipoLabel: Record<string, { label: string; className: string }> = {
  lembrete: { label: "Lembrete", className: "bg-primary/10 text-primary border-primary/20" },
  confirmacao: { label: "Confirmação", className: "bg-success/10 text-success border-success/20" },
  "pos-consulta": { label: "Pós-Consulta", className: "bg-accent text-accent-foreground border-accent" },
  aniversario: { label: "Aniversário", className: "bg-warning/10 text-warning border-warning/20" },
};

const Integracoes = () => {
  const [templates, setTemplates] = useState(templatesMock);
  const [whatsappConectado, setWhatsappConectado] = useState(false);
  const [numeroWhatsapp, setNumeroWhatsapp] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editMensagem, setEditMensagem] = useState("");

  const toggleTemplate = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ativo: !t.ativo } : t))
    );
    const template = templates.find((t) => t.id === id);
    if (template) {
      toast.success(template.ativo ? "Mensagem desativada" : "Mensagem ativada");
    }
  };

  const handleConectarWhatsapp = () => {
    if (!numeroWhatsapp) {
      toast.error("Informe o número do WhatsApp");
      return;
    }
    setWhatsappConectado(true);
    toast.success("WhatsApp conectado com sucesso!");
  };

  const handleSalvarEdicao = (id: number) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, mensagem: editMensagem } : t))
    );
    setEditandoId(null);
    toast.success("Mensagem atualizada!");
  };

  const iniciarEdicao = (template: MensagemTemplate) => {
    setEditandoId(template.id);
    setEditMensagem(template.mensagem);
  };

  const ativosCount = templates.filter((t) => t.ativo).length;

  return (
    <DashboardLayout title="Integrações">
      <div className="space-y-8 animate-fade-in">
        {/* Stats resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-card to-accent/30 border-accent/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Ativas</p>
                <p className="text-2xl font-bold text-foreground">{ativosCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status WhatsApp</p>
                <p className="text-lg font-bold text-foreground">{whatsappConectado ? "Conectado" : "Desconectado"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold text-foreground">{templates.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conexão WhatsApp */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-[#25D366]/10 to-[#25D366]/5 p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                <Smartphone className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                <CardDescription>Configure o envio automático de mensagens</CardDescription>
              </div>
              <div className="ml-auto">
                {whatsappConectado ? (
                  <Badge className="bg-success/10 text-success border-success/20 gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                    <AlertCircle className="w-3.5 h-3.5" /> Desconectado
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            {!whatsappConectado ? (
              <div className="space-y-4 max-w-md">
                <p className="text-sm text-muted-foreground">
                  Conecte seu número do WhatsApp Business para enviar lembretes automáticos aos pacientes.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Número do WhatsApp (com DDD)</Label>
                  <Input
                    id="whatsapp"
                    placeholder="+55 11 99999-0000"
                    value={numeroWhatsapp}
                    onChange={(e) => setNumeroWhatsapp(e.target.value)}
                  />
                </div>
                <Button onClick={handleConectarWhatsapp} className="gap-2">
                  <Smartphone className="w-4 h-4" /> Conectar WhatsApp
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Conectado ao número <span className="font-semibold text-foreground">{numeroWhatsapp}</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWhatsappConectado(false);
                    setNumeroWhatsapp("");
                    toast.info("WhatsApp desconectado");
                  }}
                >
                  Desconectar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Templates de mensagens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Mensagens Automáticas</h2>
              <p className="text-sm text-muted-foreground">Configure os templates de mensagens enviados aos pacientes</p>
            </div>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className={`transition-all duration-200 ${template.ativo ? "border-primary/20 shadow-sm" : "opacity-70"}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-foreground">{template.nome}</h3>
                        <Badge variant="outline" className={tipoLabel[template.tipo].className}>
                          {tipoLabel[template.tipo].label}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {template.antecedencia}
                        </div>
                      </div>

                      {editandoId === template.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editMensagem}
                            onChange={(e) => setEditMensagem(e.target.value)}
                            rows={4}
                            className="text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Variáveis disponíveis: <code className="bg-muted px-1 py-0.5 rounded">{"{nome}"}</code>{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">{"{data}"}</code>{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">{"{hora}"}</code>{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">{"{procedimento}"}</code>
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSalvarEdicao(template.id)}>Salvar</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditandoId(null)}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="bg-muted/50 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => iniciarEdicao(template)}
                        >
                          {template.mensagem}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => iniciarEdicao(template)}
                      >
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Switch
                        checked={template.ativo}
                        onCheckedChange={() => toggleTemplate(template.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dica */}
        <Card className="bg-accent/30 border-accent">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Dica: Lembretes reduzem faltas em até 40%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Estudos mostram que lembretes automáticos via WhatsApp diminuem significativamente o número de faltas em consultas.
                Ative pelo menos o lembrete de 24h para melhores resultados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Integracoes;
