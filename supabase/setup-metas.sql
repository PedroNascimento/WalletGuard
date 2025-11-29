-- ============================================
-- WALLETGUARD v2.0.0 - METAS FINANCEIRAS
-- ============================================

-- Tabela de Metas Financeiras
CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor_alvo DECIMAL(10, 2) NOT NULL CHECK (valor_alvo > 0),
  valor_atual DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_atual >= 0),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('economia', 'investimento', 'compra', 'viagem', 'educacao', 'emergencia', 'outro')),
  prazo DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluida', 'cancelada', 'atrasada')),
  cor VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contribuições para Metas
CREATE TABLE IF NOT EXISTS meta_contribuicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_id UUID NOT NULL REFERENCES metas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2) NOT NULL CHECK (valor > 0),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_metas_user_id ON metas(user_id);
CREATE INDEX IF NOT EXISTS idx_metas_status ON metas(status);
CREATE INDEX IF NOT EXISTS idx_metas_prazo ON metas(prazo);
CREATE INDEX IF NOT EXISTS idx_meta_contribuicoes_meta_id ON meta_contribuicoes(meta_id);
CREATE INDEX IF NOT EXISTS idx_meta_contribuicoes_user_id ON meta_contribuicoes(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_metas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_metas_updated_at
  BEFORE UPDATE ON metas
  FOR EACH ROW
  EXECUTE FUNCTION update_metas_updated_at();

-- Trigger para atualizar valor_atual da meta quando houver contribuição
CREATE OR REPLACE FUNCTION update_meta_valor_atual()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE metas
  SET valor_atual = valor_atual + NEW.valor
  WHERE id = NEW.meta_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_meta_valor_atual
  AFTER INSERT ON meta_contribuicoes
  FOR EACH ROW
  EXECUTE FUNCTION update_meta_valor_atual();

-- Trigger para atualizar status da meta automaticamente
CREATE OR REPLACE FUNCTION update_meta_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Se valor_atual >= valor_alvo, marcar como concluída
  IF NEW.valor_atual >= NEW.valor_alvo THEN
    NEW.status = 'concluida';
  -- Se prazo passou e não está concluída, marcar como atrasada
  ELSIF NEW.prazo < CURRENT_DATE AND NEW.status = 'em_andamento' THEN
    NEW.status = 'atrasada';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_meta_status
  BEFORE UPDATE ON metas
  FOR EACH ROW
  EXECUTE FUNCTION update_meta_status();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_contribuicoes ENABLE ROW LEVEL SECURITY;

-- Políticas para metas
CREATE POLICY "Usuários podem ver suas próprias metas"
  ON metas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias metas"
  ON metas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias metas"
  ON metas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias metas"
  ON metas FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para contribuições
CREATE POLICY "Usuários podem ver suas próprias contribuições"
  ON meta_contribuicoes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias contribuições"
  ON meta_contribuicoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias contribuições"
  ON meta_contribuicoes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Comentar ou remover em produção
-- INSERT INTO metas (user_id, titulo, descricao, valor_alvo, valor_atual, categoria, prazo, cor)
-- VALUES 
--   (auth.uid(), 'Fundo de Emergência', 'Reserva para imprevistos', 10000.00, 2500.00, 'emergencia', '2025-12-31', '#EF4444'),
--   (auth.uid(), 'Viagem para Europa', 'Férias de verão', 15000.00, 5000.00, 'viagem', '2025-06-30', '#3B82F6');
