-- ====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DO AUTOPANEL IA
-- ====================================================
-- Execute este arquivo no Supabase SQL Editor
-- Estes índices vão melhorar DRASTICAMENTE a performance
-- das buscas de produtos com 10 mil+ itens
-- ====================================================

-- 1. ÍNDICE PARA BUSCA POR NOME (case-insensitive)
-- Melhora busca por nome do produto
CREATE INDEX IF NOT EXISTS idx_products_name_gin
ON products
USING GIN (to_tsvector('portuguese', name));

-- 2. ÍNDICE PARA BUSCA POR DESCRIÇÃO
-- Melhora busca na descrição dos produtos
CREATE INDEX IF NOT EXISTS idx_products_description_gin
ON products
USING GIN (to_tsvector('portuguese', COALESCE(description, '')));

-- 3. ÍNDICE PARA CÓDIGO DO PRODUTO
-- Melhora busca por código
CREATE INDEX IF NOT EXISTS idx_products_code
ON products (code);

-- 4. ÍNDICE PARA CATEGORIA
-- Melhora filtros por categoria
CREATE INDEX IF NOT EXISTS idx_products_category
ON products (category);

-- 5. ÍNDICE PARA MARCA
-- Melhora filtros por marca
CREATE INDEX IF NOT EXISTS idx_products_brand
ON products (brand);

-- 6. ÍNDICE PARA STATUS
-- Melhora filtro de produtos ativos
CREATE INDEX IF NOT EXISTS idx_products_status
ON products (status);

-- 7. ÍNDICE PARA USER_ID + STATUS
-- Melhora consultas filtradas por usuário e status
CREATE INDEX IF NOT EXISTS idx_products_user_status
ON products (user_id, status);

-- 8. ÍNDICE PARA ESTOQUE BAIXO
-- Melhora consultas de produtos com estoque baixo
CREATE INDEX IF NOT EXISTS idx_products_low_stock
ON products (user_id, stock_quantity)
WHERE stock_quantity <= min_stock;

-- 9. ÍNDICE COMPOSTO PARA BUSCA GERAL
-- Otimiza as queries mais comuns
CREATE INDEX IF NOT EXISTS idx_products_search
ON products (user_id, status, category, brand);

-- 10. ÍNDICE PARA ORDENAÇÃO POR DATA
-- Melhora listagens ordenadas por criação
CREATE INDEX IF NOT EXISTS idx_products_created_at
ON products (created_at DESC);

-- ====================================================
-- VERIFICAR SE OS ÍNDICES FORAM CRIADOS
-- ====================================================
-- Execute este SELECT para confirmar:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'products'
-- ORDER BY indexname;

-- ====================================================
-- ESTATÍSTICAS E ANÁLISE
-- ====================================================
-- Atualizar estatísticas da tabela para melhor plano de execução
ANALYZE products;

-- ====================================================
-- OBSERVAÇÕES IMPORTANTES
-- ====================================================
-- 1. Estes índices podem demorar alguns minutos para serem criados
--    se você já tiver muitos produtos cadastrados
--
-- 2. Os índices GIN (Generalized Inverted Index) são ideais para
--    full-text search em português
--
-- 3. Se você adicionar novos produtos, os índices são atualizados
--    automaticamente
--
-- 4. Para monitorar o uso dos índices:
--    SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
--    FROM pg_stat_user_indexes
--    WHERE tablename = 'products'
--    ORDER BY idx_scan DESC;
--
-- 5. Para ver o tamanho dos índices:
--    SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid))
--    FROM pg_stat_user_indexes
--    WHERE tablename = 'products';
-- ====================================================

-- CONCLUÍDO!
-- Seus 10 mil produtos agora serão consultados em milissegundos! 🚀
