
-- Enum para cargos
CREATE TYPE public.cargo_funcionario AS ENUM ('dentista', 'recepcionista', 'auxiliar', 'administrador');

-- Enum para módulos
CREATE TYPE public.modulo_sistema AS ENUM ('agenda', 'pacientes', 'financeiro', 'integracoes');

-- Tabela de funcionários
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cargo cargo_funcionario NOT NULL DEFAULT 'auxiliar',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de permissões por funcionário
CREATE TABLE public.funcionario_permissoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  modulo modulo_sistema NOT NULL,
  tem_acesso BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(funcionario_id, modulo)
);

-- Enable RLS
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionario_permissoes ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.funcionarios
    WHERE user_id = _user_id AND cargo = 'administrador' AND ativo = true
  );
$$;

-- Policies for funcionarios
CREATE POLICY "Users can view their own employee record"
ON public.funcionarios FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all employees"
ON public.funcionarios FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create employees"
ON public.funcionarios FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update employees"
ON public.funcionarios FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete employees"
ON public.funcionarios FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Policies for funcionario_permissoes
CREATE POLICY "Users can view their own permissions"
ON public.funcionario_permissoes FOR SELECT
TO authenticated
USING (
  funcionario_id IN (
    SELECT id FROM public.funcionarios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all permissions"
ON public.funcionario_permissoes FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage permissions"
ON public.funcionario_permissoes FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update permissions"
ON public.funcionario_permissoes FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete permissions"
ON public.funcionario_permissoes FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_funcionarios_updated_at
BEFORE UPDATE ON public.funcionarios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
