import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, User, CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface Agendamento {
  id: number;
  paciente: string;
  data: string;
  hora: string;
  procedimento: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
}

const agendamentosMock: Agendamento[] = [
  { id: 1, paciente: "Ana Costa", data: "2026-04-14", hora: "08:00", procedimento: "Limpeza", status: "confirmado" },
  { id: 2, paciente: "Carlos Souza", data: "2026-04-14", hora: "09:30", procedimento: "Restauração", status: "agendado" },
  { id: 3, paciente: "Julia Lima", data: "2026-04-14", hora: "11:00", procedimento: "Canal", status: "agendado" },
  { id: 4, paciente: "Maria Silva", data: "2026-04-14", hora: "14:30", procedimento: "Consulta", status: "confirmado" },
  { id: 5, paciente: "Pedro Santos", data: "2026-04-15", hora: "10:00", procedimento: "Extração", status: "agendado" },
  { id: 6, paciente: "Fernanda Oliveira", data: "2026-04-15", hora: "14:00", procedimento: "Ortodontia", status: "confirmado" },
];

const statusLabel: Record<string, { label: string; className: string }> = {
  agendado: { label: "Agendado", className: "bg-accent text-accent-foreground border border-accent" },
  confirmado: { label: "Confirmado", className: "bg-success/10 text-success border border-success/20" },
  concluido: { label: "Concluído", className: "bg-primary/10 text-primary border border-primary/20" },
  cancelado: { label: "Cancelado", className: "bg-destructive/10 text-destructive border border-destructive/20" },
};

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState(agendamentosMock);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNovoAgendamento = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const novo: Agendamento = {
      id: Date.now(),
      paciente: form.get("paciente") as string,
      data: form.get("data") as string,
      hora: form.get("hora") as string,
      procedimento: form.get("procedimento") as string,
      status: "agendado",
    };
    setAgendamentos((prev) => [...prev, novo]);
    setDialogOpen(false);
    toast.success("Agendamento criado com sucesso!");
  };

  const datasUnicas = [...new Set(agendamentos.map((a) => a.data))].sort();

  return (
    <DashboardLayout title="Agendamentos">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Gerencie as consultas da sua clínica</p>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full mt-2 inline-block">
              {agendamentos.length} agendamentos
            </span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Agendamento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleNovoAgendamento} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paciente">Paciente</Label>
                  <Input id="paciente" name="paciente" placeholder="Nome do paciente" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" name="data" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Horário</Label>
                    <Input id="hora" name="hora" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="procedimento">Procedimento</Label>
                  <Select name="procedimento" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta">Consulta</SelectItem>
                      <SelectItem value="Limpeza">Limpeza</SelectItem>
                      <SelectItem value="Restauração">Restauração</SelectItem>
                      <SelectItem value="Canal">Canal</SelectItem>
                      <SelectItem value="Extração">Extração</SelectItem>
                      <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                      <SelectItem value="Implante">Implante</SelectItem>
                      <SelectItem value="Clareamento">Clareamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Agendar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {datasUnicas.map((data) => (
          <Card key={data} className="overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-card to-accent/20 border-b border-border">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <CardTitle className="text-base capitalize">
                  {new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {agendamentos
                .filter((a) => a.data === data)
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((ag) => (
                  <div key={ag.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/20 hover:shadow-sm transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <span className="text-sm font-bold text-primary font-mono">{ag.hora}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <p className="font-semibold text-sm text-foreground">{ag.paciente}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-5 mt-0.5">{ag.procedimento}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusLabel[ag.status].className}`}>
                      {statusLabel[ag.status].label}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;
