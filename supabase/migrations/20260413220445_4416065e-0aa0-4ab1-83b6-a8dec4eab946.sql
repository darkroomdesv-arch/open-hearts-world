
-- Enum para status de agendamento
CREATE TYPE public.status_agendamento AS ENUM ('agendado', 'confirmado', 'concluido', 'cancelado');

-- Enum para tipo financeiro
CREATE TYPE public.tipo_financeiro AS ENUM ('receita', 'despesa');

-- Enum para status de pagamento
CREATE TYPE public.status_pagamento AS ENUM ('pendente', 'pago', 'cancelado');

-- Tabela de pacientes
CREATE TABLE public.pacientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  data_nascimento DATE,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view patients" ON public.pacientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create patients" ON public.pacientes FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update patients" ON public.pacientes FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete patients" ON public.pacientes FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON public.pacientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 30,
  status public.status_agendamento NOT NULL DEFAULT 'agendado',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view appointments" ON public.agendamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create appointments" ON public.agendamentos FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update appointments" ON public.agendamentos FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete appointments" ON public.agendamentos FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE INDEX idx_agendamentos_data ON public.agendamentos(data_hora);
CREATE INDEX idx_agendamentos_paciente ON public.agendamentos(paciente_id);
CREATE INDEX idx_agendamentos_funcionario ON public.agendamentos(funcionario_id);

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela financeira
CREATE TABLE public.financeiro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo public.tipo_financeiro NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE SET NULL,
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  forma_pagamento TEXT,
  status_pagamento public.status_pagamento NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view financeiro" ON public.financeiro FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create financeiro" ON public.financeiro FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update financeiro" ON public.financeiro FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete financeiro" ON public.financeiro FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE INDEX idx_financeiro_data ON public.financeiro(data);
CREATE INDEX idx_financeiro_tipo ON public.financeiro(tipo);

CREATE TRIGGER update_financeiro_updated_at BEFORE UPDATE ON public.financeiro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
