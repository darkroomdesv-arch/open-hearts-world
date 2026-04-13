import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [clinica, setClinica] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha || !clinica) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DC</span>
            </div>
            <span className="font-bold text-xl text-foreground">DentaClin</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Comece a usar o DentaClin gratuitamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Dr. João Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinica">Nome da clínica</Label>
                <Input id="clinica" placeholder="Clínica Sorriso" value={clinica} onChange={(e) => setClinica(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta Gratuita"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
