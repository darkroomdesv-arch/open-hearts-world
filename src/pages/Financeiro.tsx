import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react";

const resumo = [
  { title: "Receita do Mês", value: "R$ 18.450", icon: TrendingUp, color: "text-success", gradient: "from-success/5 to-success/0 border-success/15" },
  { title: "Despesas do Mês", value: "R$ 5.320", icon: TrendingDown, color: "text-destructive", gradient: "from-destructive/5 to-destructive/0 border-destructive/15" },
  { title: "Lucro Líquido", value: "R$ 13.130", icon: DollarSign, color: "text-primary", gradient: "from-primary/5 to-primary/0 border-primary/15" },
  { title: "A Receber", value: "R$ 4.200", icon: Receipt, color: "text-warning", gradient: "from-warning/5 to-warning/0 border-warning/15" },
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
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumo.map((item) => (
            <Card key={item.title} className={`bg-gradient-to-br ${item.gradient} overflow-hidden`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-card to-accent/20 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Últimos Lançamentos</CardTitle>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {lancamentos.length} registros
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {lancamentos.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/20 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${l.tipo === "receita" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {l.tipo === "receita" ? (
                        <ArrowUpRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{l.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{l.data}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${l.tipo === "receita" ? "text-success" : "text-destructive"}`}>
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
