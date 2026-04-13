import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";

const resumo = [
  { title: "Receita do Mês", value: "R$ 18.450,00", icon: TrendingUp, color: "text-success" },
  { title: "Despesas do Mês", value: "R$ 5.320,00", icon: TrendingDown, color: "text-destructive" },
  { title: "Lucro Líquido", value: "R$ 13.130,00", icon: DollarSign, color: "text-primary" },
  { title: "A Receber", value: "R$ 4.200,00", icon: Receipt, color: "text-warning" },
];

const lancamentos = [
  { data: "13/04/2026", descricao: "Consulta - Maria Silva", tipo: "receita", valor: "R$ 350,00" },
  { data: "13/04/2026", descricao: "Material odontológico", tipo: "despesa", valor: "R$ 890,00" },
  { data: "12/04/2026", descricao: "Implante - Pedro Santos", tipo: "receita", valor: "R$ 3.500,00" },
  { data: "12/04/2026", descricao: "Canal - Julia Lima", tipo: "receita", valor: "R$ 1.200,00" },
  { data: "11/04/2026", descricao: "Aluguel do consultório", tipo: "despesa", valor: "R$ 2.800,00" },
  { data: "11/04/2026", descricao: "Limpeza - Ana Costa", tipo: "receita", valor: "R$ 280,00" },
  { data: "10/04/2026", descricao: "Restauração - Carlos Souza", tipo: "receita", valor: "R$ 450,00" },
  { data: "10/04/2026", descricao: "Conta de energia", tipo: "despesa", valor: "R$ 380,00" },
];

const Financeiro = () => {
  return (
    <DashboardLayout title="Financeiro">
      <div className="space-y-6 animate-fade-in">
        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumo.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lançamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos Lançamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lancamentos.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20">{l.data}</span>
                    <p className="text-sm text-foreground">{l.descricao}</p>
                  </div>
                  <span className={`text-sm font-semibold ${l.tipo === "receita" ? "text-success" : "text-destructive"}`}>
                    {l.tipo === "receita" ? "+" : "-"} {l.valor}
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

export default Financeiro;
