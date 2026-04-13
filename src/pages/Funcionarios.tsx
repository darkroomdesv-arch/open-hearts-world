import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, UserCog, Shield, Calendar, Users, DollarSign, Plug, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Cargo = "dentista" | "recepcionista" | "auxiliar" | "administrador";
type Modulo = "agenda" | "pacientes" | "financeiro" | "integracoes";

const cargoLabels: Record<Cargo, { label: string; className: string }> = {
  administrador: { label: "Administrador", className: "bg-primary/10 text-primary border-primary/20" },
  dentista: { label: "Dentista", className: "bg-success/10 text-success border-success/20" },
  recepcionista: { label: "Recepcionista", className: "bg-warning/10 text-warning border-warning/20" },
  auxiliar: { label: "Auxiliar", className: "bg-accent text-accent-foreground border-accent" },
};

const moduloLabels: Record<Modulo, { label: string; icon: typeof Calendar }> = {
  agenda: { label: "Agenda", icon: Calendar },
  pacientes: { label: "Pacientes", icon: Users },
  financeiro: { label: "Financeiro", icon: DollarSign },
  integracoes: { label: "Integrações", icon: Plug },
};

const modulos: Modulo[] = ["agenda", "pacientes", "financeiro", "integracoes"];

const Funcionarios = () => {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [permissoesDialog, setPermissoesDialog] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState<Cargo>("auxiliar");

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funcionarios")
        .select("*, funcionario_permissoes(*)")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      // Create funcionario
      const { data: func, error } = await supabase
        .from("funcionarios")
        .insert({ nome, email, telefone: telefone || null, cargo })
        .select()
        .single();
      if (error) throw error;

      // Create default permissions (admin gets all, others get none)
      const perms = modulos.map((modulo) => ({
        funcionario_id: func.id,
        modulo,
        tem_acesso: cargo === "administrador",
      }));
      const { error: permError } = await supabase
        .from("funcionario_permissoes")
        .insert(perms);
      if (permError) throw permError;

      return func;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      resetForm();
      setDialogOpen(false);
      toast.success("Funcionário cadastrado!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("funcionarios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário removido!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("funcionarios").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["funcionarios"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const togglePermissaoMutation = useMutation({
    mutationFn: async ({ id, tem_acesso }: { id: string; tem_acesso: boolean }) => {
      const { error } = await supabase
        .from("funcionario_permissoes")
        .update({ tem_acesso })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["funcionarios"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setCargo("auxiliar");
  };

  const filtrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.email.toLowerCase().includes(busca.toLowerCase())
  );

  const funcPermissoes = permissoesDialog
    ? funcionarios.find((f) => f.id === permissoesDialog)
    : null;

  return (
    <DashboardLayout title="Funcionários">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {(["administrador", "dentista", "recepcionista", "auxiliar"] as Cargo[]).map((c) => {
            const count = funcionarios.filter((f) => f.cargo === c && f.ativo).length;
            return (
              <Card key={c} className="bg-gradient-to-br from-card to-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-background/80 flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{cargoLabels[c].label}s</p>
                    <p className="text-xl font-bold text-foreground">{count}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar funcionário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full whitespace-nowrap">
              {filtrados.length} funcionários
            </span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Funcionário</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Funcionário</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createMutation.mutate();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do funcionário" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="funcionario@clinica.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Select value={cargo} onValueChange={(v) => setCargo(v as Cargo)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="dentista">Dentista</SelectItem>
                      <SelectItem value="recepcionista">Recepcionista</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {cargo === "administrador"
                    ? "Administradores recebem acesso a todos os módulos automaticamente."
                    : "As permissões podem ser configuradas após o cadastro."}
                </p>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <UserCog className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum funcionário encontrado</p>
            <p className="text-sm mt-1">Cadastre o primeiro funcionário da clínica</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrados.map((func) => (
              <Card key={func.id} className={`transition-all duration-200 hover:shadow-sm ${!func.ativo ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {func.nome.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground text-sm">{func.nome}</p>
                          <Badge variant="outline" className={cargoLabels[func.cargo].className}>
                            {cargoLabels[func.cargo].label}
                          </Badge>
                          {!func.ativo && (
                            <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {func.email} {func.telefone && `· ${func.telefone}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Permissões rápidas */}
                      <div className="hidden md:flex items-center gap-1.5 mr-2">
                        {func.funcionario_permissoes?.map((perm: any) => {
                          const mod = moduloLabels[perm.modulo as Modulo];
                          if (!mod) return null;
                          const Icon = mod.icon;
                          return (
                            <div
                              key={perm.id}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                perm.tem_acesso ? "bg-success/10 text-success" : "bg-muted text-muted-foreground/40"
                              }`}
                              title={`${mod.label}: ${perm.tem_acesso ? "Com acesso" : "Sem acesso"}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          );
                        })}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPermissoesDialog(func.id)}
                        title="Gerenciar permissões"
                      >
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Switch
                        checked={func.ativo}
                        onCheckedChange={(ativo) => toggleAtivoMutation.mutate({ id: func.id, ativo })}
                        title={func.ativo ? "Desativar" : "Ativar"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Remover este funcionário?")) {
                            deleteMutation.mutate(func.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de permissões */}
        <Dialog open={!!permissoesDialog} onOpenChange={(open) => !open && setPermissoesDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Permissões — {funcPermissoes?.nome}</DialogTitle>
            </DialogHeader>
            {funcPermissoes && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Defina quais módulos <span className="font-medium text-foreground">{funcPermissoes.nome}</span> pode acessar.
                </p>
                <div className="space-y-3">
                  {modulos.map((modulo) => {
                    const perm = funcPermissoes.funcionario_permissoes?.find(
                      (p: any) => p.modulo === modulo
                    );
                    const mod = moduloLabels[modulo];
                    const Icon = mod.icon;
                    return (
                      <div
                        key={modulo}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${perm?.tem_acesso ? "bg-success/10" : "bg-muted"}`}>
                            <Icon className={`w-4 h-4 ${perm?.tem_acesso ? "text-success" : "text-muted-foreground"}`} />
                          </div>
                          <span className="font-medium text-sm text-foreground">{mod.label}</span>
                        </div>
                        <Switch
                          checked={perm?.tem_acesso ?? false}
                          onCheckedChange={(checked) => {
                            if (perm) {
                              togglePermissaoMutation.mutate({ id: perm.id, tem_acesso: checked });
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Funcionarios;
