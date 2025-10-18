-- ====================================================
-- CRIAR TABELAS DE CHAT (CONVERSAS E MENSAGENS)
-- ====================================================
-- Execute este SQL no Supabase SQL Editor
-- Este script é SEGURO para executar múltiplas vezes
-- ====================================================

-- 1. CRIAR TABELA DE CONVERSAS
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conversation_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'active', -- active, closed
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_by UUID,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADICIONAR CONSTRAINTS FOREIGN KEY (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_conversations_user_id_fkey'
  ) THEN
    ALTER TABLE chat_conversations
    ADD CONSTRAINT chat_conversations_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_conversations_closed_by_fkey'
  ) THEN
    ALTER TABLE chat_conversations
    ADD CONSTRAINT chat_conversations_closed_by_fkey
    FOREIGN KEY (closed_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_conversation_id ON chat_conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON chat_conversations(created_at DESC);

-- 4. HABILITAR RLS (Row Level Security)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICAS DE SEGURANÇA (drop se já existir)
DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;
CREATE POLICY "Users can view their own conversations" ON chat_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own conversations" ON chat_conversations;
CREATE POLICY "Users can insert their own conversations" ON chat_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON chat_conversations;
CREATE POLICY "Users can update their own conversations" ON chat_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON chat_conversations;
CREATE POLICY "Users can delete their own conversations" ON chat_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================================
-- TABELA DE MENSAGENS
-- ====================================================

-- 6. CRIAR TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ADICIONAR CONSTRAINT FOREIGN KEY (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chat_messages_user_id_fkey'
  ) THEN
    ALTER TABLE chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 8. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

-- 9. HABILITAR RLS PARA MENSAGENS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 10. CRIAR POLÍTICAS PARA MENSAGENS (drop se já existir)
DROP POLICY IF EXISTS "Users can view their own messages" ON chat_messages;
CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
CREATE POLICY "Users can insert their own messages" ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON chat_messages;
CREATE POLICY "Users can update their own messages" ON chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;
CREATE POLICY "Users can delete their own messages" ON chat_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- 11. VERIFICAR SE TUDO FOI CRIADO
SELECT
  'Tabela chat_conversations criada!' as status,
  COUNT(*) as total_conversas
FROM chat_conversations;

SELECT
  'Tabela chat_messages criada!' as status,
  COUNT(*) as total_mensagens
FROM chat_messages;

-- ====================================================
-- CONCLUÍDO SEM ERROS!
-- ====================================================
-- Agora suas conversas do chat serão persistentes
-- e o histórico será mantido mesmo após F5
-- ====================================================
