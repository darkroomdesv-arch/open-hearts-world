import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Clock, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { title: "Consultas Hoje", value: "8", icon: Calendar, change: "+2 que ontem", trend: "up" },
  { title: "Pacientes Ativos", value: "247", icon: Users, change: "+12 este mês", trend: "up" },
  { title: "Receita do Mês", value: "R$ 18.450", icon: DollarSign, change: "+8% vs mês anterior", trend: "up" },
  { title: "Próxima Consulta", value: "14:30", icon: Clock, change: "Maria Silva", trend: "neutral" },
];

const consultasHoje = [
  { hora: "08:00", paciente: "Ana Costa", procedimento: "Limpeza", status: "Concluída" },
  { hora: "09:30", paciente: "Carlos Souza", procedimento: "Restauração", status: "Concluída" },
  { hora: "11:00", paciente: "Julia Lima", procedimento: "Canal", status: "Em andamento" },
  { hora: "14:30", paciente: "Maria Silva", procedimento: "Consulta", status: "Aguardando" },
  { hora: "16:00", paciente: "Pedro Santos", procedimento: "Extração", status: "Aguardando" },
];

const statusColors: Record<string, string> = {
  "Concluída": "bg-success/10 text-success border border-success/20",
  "Em andamento": "bg-warning/10 text-warning border border-warning/20",
  "Aguardando": "bg-muted text-muted-foreground border border-border",
};

const gradients = [
  "from-primary/5 to-primary/0 border-primary/15",
  "from-success/5 to-success/0 border-success/15",
  "from-warning/5 to-warning/0 border-warning/15",
  "from-accent to-accent/0 border-accent",
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Painel">
      <div className="space-y-8 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={stat.title} className={`bg-gradient-to-br ${gradients[i]} overflow-hidden`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1 pt-1">
                      {stat.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-success" />}
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultas de hoje */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-card to-accent/20 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Consultas de Hoje</CardTitle>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {consultasHoje.length} consultas
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {consultasHoje.map((consulta, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="text-sm font-bold text-primary font-mono">{consulta.hora}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{consulta.paciente}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{consulta.procedimento}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColors[consulta.status]}`}>
                    {consulta.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
