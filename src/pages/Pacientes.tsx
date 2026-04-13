import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Phone, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  ultimaConsulta: string;
}

const pacientesMock: Paciente[] = [
  { id: 1, nome: "Ana Costa", email: "ana@email.com", telefone: "(11) 99999-1111", dataNascimento: "1990-03-15", ultimaConsulta: "2026-04-10" },
  { id: 2, nome: "Carlos Souza", email: "carlos@email.com", telefone: "(11) 99999-2222", dataNascimento: "1985-07-22", ultimaConsulta: "2026-04-08" },
  { id: 3, nome: "Julia Lima", email: "julia@email.com", telefone: "(11) 99999-3333", dataNascimento: "1992-11-30", ultimaConsulta: "2026-04-05" },
  { id: 4, nome: "Maria Silva", email: "maria@email.com", telefone: "(11) 99999-4444", dataNascimento: "1988-01-10", ultimaConsulta: "2026-03-20" },
  { id: 5, nome: "Pedro Santos", email: "pedro@email.com", telefone: "(11) 99999-5555", dataNascimento: "1995-06-18", ultimaConsulta: "2026-04-12" },
  { id: 6, nome: "Fernanda Oliveira", email: "fernanda@email.com", telefone: "(11) 99999-6666", dataNascimento: "1993-09-25", ultimaConsulta: "2026-04-11" },
];

const Pacientes = () => {
  const [pacientes, setPacientes] = useState(pacientesMock);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.email.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovoPaciente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const novo: Paciente = {
      id: Date.now(),
      nome: form.get("nome") as string,
      email: form.get("email") as string,
      telefone: form.get("telefone") as string,
      dataNascimento: form.get("dataNascimento") as string,
      ultimaConsulta: "-",
    };
    setPacientes((prev) => [...prev, novo]);
    setDialogOpen(false);
    toast.success("Paciente cadastrado com sucesso!");
  };

  return (
    <DashboardLayout title="Pacientes">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Novo Paciente</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Paciente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleNovoPaciente} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" name="nome" placeholder="Nome do paciente" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="paciente@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" placeholder="(11) 99999-0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de nascimento</Label>
                  <Input id="dataNascimento" name="dataNascimento" type="date" required />
                </div>
                <Button type="submit" className="w-full">Cadastrar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((paciente) => (
            <Card key={paciente.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-accent-foreground">
                      {paciente.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{paciente.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(paciente.dataNascimento + "T12:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{paciente.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{paciente.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Última consulta: {paciente.ultimaConsulta === "-" ? "-" : new Date(paciente.ultimaConsulta + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum paciente encontrado.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Pacientes;
