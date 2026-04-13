import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";

const stats = [
  { title: "Consultas Hoje", value: "8", icon: Calendar, change: "+2 que ontem" },
  { title: "Pacientes Ativos", value: "247", icon: Users, change: "+12 este mês" },
  { title: "Receita do Mês", value: "R$ 18.450", icon: DollarSign, change: "+8% vs mês anterior" },
  { title: "Próxima Consulta", value: "14:30", icon: Clock, change: "Maria Silva" },
];

const consultasHoje = [
  { hora: "08:00", paciente: "Ana Costa", procedimento: "Limpeza", status: "Concluída" },
  { hora: "09:30", paciente: "Carlos Souza", procedimento: "Restauração", status: "Concluída" },
  { hora: "11:00", paciente: "Julia Lima", procedimento: "Canal", status: "Em andamento" },
  { hora: "14:30", paciente: "Maria Silva", procedimento: "Consulta", status: "Aguardando" },
  { hora: "16:00", paciente: "Pedro Santos", procedimento: "Extração", status: "Aguardando" },
];

const statusColors: Record<string, string> = {
  "Concluída": "bg-success/10 text-success",
  "Em andamento": "bg-warning/10 text-warning",
  "Aguardando": "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  return (
    <DashboardLayout title="Painel">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultas de hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consultasHoje.map((consulta, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground w-12">{consulta.hora}</span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{consulta.paciente}</p>
                      <p className="text-xs text-muted-foreground">{consulta.procedimento}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[consulta.status]}`}>
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
