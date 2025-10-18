# ⚡ GUIA RÁPIDO - AUTOPANEL IA OTIMIZADO

## 🎯 3 PASSOS PARA COMEÇAR

### **PASSO 1: Executar Índices no Banco (5 minutos)**

1. Abra seu **Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Faça login

2. Selecione seu projeto **gtxap**

3. No menu lateral, clique em **SQL Editor**

4. Abra o arquivo `database-indexes.sql` no seu computador
   - Localização: `C:\Users\guilh\ap\gtxap\database-indexes.sql`

5. **Copie TODO o conteúdo** do arquivo

6. **Cole** no SQL Editor do Supabase

7. Clique em **RUN** (ou pressione Ctrl+Enter)

8. Aguarde a mensagem: ✅ **Success. No rows returned**

**Pronto! Seus índices estão criados.**

---

### **PASSO 2: Deploy da Nova Versão**

Se seu projeto está no **Vercel**:

```bash
# No terminal, dentro da pasta gtxap:
cd C:\Users\guilh\ap\gtxap

# Adicionar arquivos modificados
git add .

# Criar commit
git commit -m "feat: IA otimizada para 10k produtos + foco em custos"

# Enviar para repositório
git push origin main
```

**O Vercel vai fazer deploy automático em ~2 minutos.**

---

### **PASSO 3: Testar o Sistema**

1. Acesse seu dashboard: https://seu-projeto.vercel.app/dashboard

2. Vá para a aba do **Chat IA**

3. **Teste estes cenários:**

#### 📝 **Teste 1: Orçamento Completo**
```
Digite: "Orçamento para João Silva - 10 disjuntores DR 20A"
```
**Esperado:** A IA deve criar um orçamento formatado com custos

#### 🔍 **Teste 2: Busca de Produto**
```
Digite: "Tem bomba de piscina?"
```
**Esperado:** A IA deve listar produtos encontrados com custos e estoque

#### ⚠️ **Teste 3: Estoque Baixo**
```
Digite: "Quais produtos estão com estoque baixo?"
```
**Esperado:** Lista de produtos com estoque abaixo do mínimo

#### 💬 **Teste 4: Conversação Estruturada**
```
Digite: "Preciso criar um orçamento"
```
**Esperado:** A IA deve perguntar nome do cliente, empresa, etc.

---

## ✅ CHECKLIST DE VALIDAÇÃO

Marque cada item após testar:

- [ ] Índices criados no Supabase (sem erros)
- [ ] Deploy realizado com sucesso
- [ ] Chat IA responde em menos de 3 segundos
- [ ] IA encontra produtos corretamente
- [ ] IA mostra CUSTOS (não preços de venda)
- [ ] IA pergunta dados do cliente quando necessário
- [ ] IA mostra estoque disponível
- [ ] Orçamentos são criados formatados

---

## 🚨 RESOLUÇÃO DE PROBLEMAS

### Problema: "Erro ao executar índices SQL"

**Solução:**
1. Verifique se você está logado no projeto correto
2. Execute os comandos um por um (copie cada CREATE INDEX separadamente)
3. Se algum índice já existir, o erro pode ser ignorado

---

### Problema: "IA não responde ou dá timeout"

**Soluções:**
1. **Verifique GEMINI_API_KEY:**
   - No Vercel Dashboard > Settings > Environment Variables
   - Confirme que `GEMINI_API_KEY` está configurada

2. **Verifique logs:**
   - Vercel Dashboard > Deployments > Clique no último deploy > Functions
   - Procure por erros na função `/api/chat`

3. **Limpe cache:**
   - Ctrl+Shift+R no browser
   - Ou abra em aba anônima

---

### Problema: "IA não encontra produtos"

**Soluções:**
1. **Verifique produtos no banco:**
   ```sql
   -- Execute no Supabase SQL Editor
   SELECT COUNT(*) FROM products WHERE status = 'active';
   ```

2. **Verifique se produtos têm `user_id` correto:**
   ```sql
   SELECT user_id, COUNT(*)
   FROM products
   GROUP BY user_id;
   ```

3. **Refaça os índices:**
   - Execute `database-indexes.sql` novamente

---

## 📊 VERIFICAR PERFORMANCE

Execute no **Supabase SQL Editor**:

```sql
-- Ver quantos produtos você tem
SELECT COUNT(*) as total_produtos FROM products;

-- Ver quantos estão ativos
SELECT COUNT(*) as produtos_ativos
FROM products
WHERE status = 'active' OR status = 'ativo' OR status IS NULL;

-- Ver se índices estão sendo usados
SELECT
  indexname,
  idx_scan as "Vezes Usado",
  pg_size_pretty(pg_relation_size(indexrelid)) as "Tamanho"
FROM pg_stat_user_indexes
WHERE tablename = 'products'
ORDER BY idx_scan DESC
LIMIT 10;
```

**O que esperar:**
- `idx_scan` > 0 significa que o índice está sendo usado
- Tamanho dos índices varia conforme quantidade de produtos

---

## 🎯 PRÓXIMOS PASSOS APÓS VALIDAÇÃO

Após confirmar que tudo funciona:

1. **Treine sua equipe:**
   - Mostre exemplos de uso
   - Ensine a fazer perguntas específicas
   - Explique que IA retorna CUSTOS (não preços)

2. **Monitore uso:**
   - Verifique logs no Vercel
   - Acompanhe velocidade de resposta
   - Colete feedback dos vendedores

3. **Ajuste conforme necessário:**
   - Se precisar mais produtos por resposta, edite linha 209 de `route.ts`
   - Se precisar ajustar prompt, edite a partir da linha 221

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:

1. **Verifique logs do Vercel:**
   - Deployments > Latest > Functions > api/chat

2. **Verifique console do browser:**
   - F12 > Console (procure erros em vermelho)

3. **Teste conexão Gemini:**
   ```bash
   # No terminal do projeto:
   npm run dev

   # Acesse: http://localhost:3000/dashboard
   # Teste o chat
   # Veja logs no terminal
   ```

---

## 🎉 ESTÁ PRONTO!

Se todos os testes passaram, seu sistema está funcionando perfeitamente!

**Benefícios que você tem agora:**
- ✅ Busca em 10 mil+ produtos instantaneamente
- ✅ Orçamentos estruturados automaticamente
- ✅ Foco em custos (não preços)
- ✅ Conversação inteligente
- ✅ Performance otimizada

**Bom trabalho! 🚀**

---

**Dúvidas? Leia:** `MELHORIAS-IA.md` (documentação completa)
