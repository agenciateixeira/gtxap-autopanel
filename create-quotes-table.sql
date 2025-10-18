-- ====================================================
-- CRIAR TABELA DE ORÇAMENTOS (QUOTES)
-- ====================================================
-- Execute este SQL no Supabase SQL Editor
-- ====================================================

-- 1. CRIAR TABELA DE ORÇAMENTOS
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number VARCHAR(50) NOT NULL UNIQUE,

  -- Dados do Cliente
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_company VARCHAR(255),

  -- Dados do Orçamento
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  value DECIMAL(10, 2), -- Para compatibilidade
  discount DECIMAL(5, 2) DEFAULT 0,
  notes TEXT,
  valid_until DATE,

  -- Status e Origem
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, approved, rejected, expired
  created_from_chat BOOLEAN DEFAULT false,
  chat_conversation_id VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Índices
  CONSTRAINT quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_chat_conversation ON quotes(chat_conversation_id);

-- 3. HABILITAR RLS (Row Level Security)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS DE SEGURANÇA
-- Usuários podem ver apenas seus próprios orçamentos
CREATE POLICY "Users can view their own quotes" ON quotes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir seus próprios orçamentos
CREATE POLICY "Users can insert their own quotes" ON quotes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios orçamentos
CREATE POLICY "Users can update their own quotes" ON quotes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios orçamentos
CREATE POLICY "Users can delete their own quotes" ON quotes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. VERIFICAR SE A TABELA quote_items EXISTE
-- Se não existir, criar
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT quote_items_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

-- 6. CRIAR ÍNDICES PARA quote_items
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- 7. HABILITAR RLS PARA quote_items
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- 8. CRIAR POLÍTICAS PARA quote_items
-- Usuários podem ver itens dos seus orçamentos
CREATE POLICY "Users can view their own quote items" ON quote_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

-- Usuários podem inserir itens nos seus orçamentos
CREATE POLICY "Users can insert their own quote items" ON quote_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

-- Usuários podem atualizar itens dos seus orçamentos
CREATE POLICY "Users can update their own quote items" ON quote_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

-- Usuários podem deletar itens dos seus orçamentos
CREATE POLICY "Users can delete their own quote items" ON quote_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

-- 9. VERIFICAR SE TUDO FOI CRIADO
SELECT
  'Tabela quotes criada!' as status,
  COUNT(*) as total_orcamentos
FROM quotes;

SELECT
  'Tabela quote_items criada!' as status,
  COUNT(*) as total_itens
FROM quote_items;

-- ====================================================
-- CONCLUÍDO!
-- ====================================================
-- Execute no Supabase SQL Editor:
-- 1. Copie TODO este arquivo
-- 2. Cole no SQL Editor
-- 3. Clique em RUN
-- 4. Verifique se não há erros
-- ====================================================
