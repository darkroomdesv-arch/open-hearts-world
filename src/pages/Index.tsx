import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Shield, Clock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description: "Gerencie consultas com calendário visual, lembretes automáticos e controle de horários.",
  },
  {
    icon: Users,
    title: "Cadastro de Pacientes",
    description: "Prontuário digital completo com histórico, documentos e odontograma.",
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description: "Orçamentos, contas a receber, relatórios e fluxo de caixa em tempo real.",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Dados criptografados e em conformidade com a LGPD para proteção dos seus pacientes.",
  },
  {
    icon: Clock,
    title: "Disponível 24h",
    description: "Acesse de qualquer lugar, a qualquer momento. Seus dados sempre na nuvem.",
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Funciona perfeitamente em computadores, tablets e smartphones.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DC</span>
            </div>
            <span className="font-bold text-xl text-foreground">DentaClin</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Funcionalidades
            </a>
            <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Sobre
            </a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm">Começar Grátis</Button>
            </Link>
          </nav>
          <Link to="/login" className="md:hidden">
            <Button size="sm">Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sistema completo para sua clínica
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              Gestão odontológica{" "}
              <span className="text-primary">simples e moderna</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Agende consultas, gerencie pacientes e controle suas finanças em um único lugar. 
              Tudo pensado para dentistas que querem praticidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/cadastro">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Começar Gratuitamente
                </Button>
              </Link>
              <a href="#funcionalidades">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Ver Funcionalidades
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              ✓ Sem cartão de crédito &nbsp; ✓ 14 dias grátis &nbsp; ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tudo que sua clínica precisa
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas poderosas e fáceis de usar para modernizar o dia a dia do seu consultório.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border hover:border-primary/30 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="sobre" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-primary rounded-2xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para modernizar sua clínica?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Junte-se a centenas de dentistas que já simplificaram sua rotina com o DentaClin.
            </p>
            <Link to="/cadastro">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 DentaClin. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
