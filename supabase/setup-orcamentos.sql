-- ============================================
-- WALLETGUARD v2.0.0 - ORÇAMENTOS
-- ============================================

-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020),
  valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  valor_gasto DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_gasto >= 0),
  categorias JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'excedido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mes, ano)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id ON orcamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_mes_ano ON orcamentos(mes, ano);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_orcamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orcamentos_updated_at
  BEFORE UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_orcamentos_updated_at();

-- Trigger para calcular valor_total automaticamente
CREATE OR REPLACE FUNCTION calculate_orcamento_total()
RETURNS TRIGGER AS $$
DECLARE
  total DECIMAL(10, 2) := 0;
  categoria JSONB;
BEGIN
  -- Somar todos os valores_planejados das categorias
  FOR categoria IN SELECT jsonb_array_elements(NEW.categorias)
  LOOP
    total := total + (categoria->>'valor_planejado')::DECIMAL(10, 2);
  END LOOP;
  
  NEW.valor_total := total;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_orcamento_total
  BEFORE INSERT OR UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION calculate_orcamento_total();

-- Trigger para atualizar status do orçamento
CREATE OR REPLACE FUNCTION update_orcamento_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Se valor_gasto > valor_total, marcar como excedido
  IF NEW.valor_gasto > NEW.valor_total THEN
    NEW.status = 'excedido';
  -- Se o mês/ano passou, marcar como concluído
  ELSIF (NEW.ano < EXTRACT(YEAR FROM CURRENT_DATE) OR 
         (NEW.ano = EXTRACT(YEAR FROM CURRENT_DATE) AND NEW.mes < EXTRACT(MONTH FROM CURRENT_DATE))) 
         AND NEW.status = 'ativo' THEN
    NEW.status = 'concluido';
  ELSE
    NEW.status = 'ativo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orcamento_status
  BEFORE UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_orcamento_status();

-- Função para atualizar valor_gasto do orçamento baseado nas despesas
CREATE OR REPLACE FUNCTION sync_orcamento_valor_gasto(
  p_user_id UUID,
  p_mes INTEGER,
  p_ano INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_orcamento_id UUID;
  v_total_gasto DECIMAL(10, 2);
  v_categoria JSONB;
  v_categorias JSONB := '[]'::jsonb;
  v_cat_nome TEXT;
  v_cat_planejado DECIMAL(10, 2);
  v_cat_gasto DECIMAL(10, 2);
  v_cat_cor TEXT;
BEGIN
  -- Buscar o orçamento
  SELECT id INTO v_orcamento_id
  FROM orcamentos
  WHERE user_id = p_user_id AND mes = p_mes AND ano = p_ano;
  
  IF v_orcamento_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Buscar categorias do orçamento
  SELECT categorias INTO v_categorias
  FROM orcamentos
  WHERE id = v_orcamento_id;
  
  -- Atualizar valor_gasto de cada categoria
  FOR v_categoria IN SELECT jsonb_array_elements(v_categorias)
  LOOP
    v_cat_nome := v_categoria->>'categoria';
    v_cat_planejado := (v_categoria->>'valor_planejado')::DECIMAL(10, 2);
    v_cat_cor := v_categoria->>'cor';
    
    -- Calcular gasto real da categoria no mês/ano
    SELECT COALESCE(SUM(valor), 0) INTO v_cat_gasto
    FROM expenses
    WHERE user_id = p_user_id
      AND categoria = v_cat_nome
      AND EXTRACT(MONTH FROM data) = p_mes
      AND EXTRACT(YEAR FROM data) = p_ano;
    
    -- Atualizar categoria com valor_gasto
    v_categoria := jsonb_build_object(
      'categoria', v_cat_nome,
      'valor_planejado', v_cat_planejado,
      'valor_gasto', v_cat_gasto,
      'cor', v_cat_cor
    );
    
    -- Adicionar à lista de categorias atualizadas
    v_categorias := v_categorias - (jsonb_array_length(v_categorias) - 1);
    v_categorias := v_categorias || v_categoria;
  END LOOP;
  
  -- Calcular total gasto
  SELECT COALESCE(SUM((jsonb_array_elements(v_categorias)->>'valor_gasto')::DECIMAL(10, 2)), 0)
  INTO v_total_gasto;
  
  -- Atualizar orçamento
  UPDATE orcamentos
  SET categorias = v_categorias,
      valor_gasto = v_total_gasto
  WHERE id = v_orcamento_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para orçamentos
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON orcamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios orçamentos"
  ON orcamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON orcamentos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
  ON orcamentos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Comentar ou remover em produção
-- INSERT INTO orcamentos (user_id, nome, mes, ano, categorias)
-- VALUES (
--   auth.uid(),
--   'Orçamento Dezembro 2025',
--   12,
--   2025,
--   '[
--     {"categoria": "alimentacao", "valor_planejado": 1500.00, "valor_gasto": 0, "cor": "#10B981"},
--     {"categoria": "transporte", "valor_planejado": 500.00, "valor_gasto": 0, "cor": "#3B82F6"},
--     {"categoria": "moradia", "valor_planejado": 2000.00, "valor_gasto": 0, "cor": "#F59E0B"}
--   ]'::jsonb
-- );
