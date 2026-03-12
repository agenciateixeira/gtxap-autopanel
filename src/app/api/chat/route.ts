import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Interface para tipagem dos produtos
interface Product {
  id?: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  unit?: string;
  stock_quantity?: number;
  min_stock?: number;
  price?: number;
  cost?: number;
  supplier?: string;
  location?: string;
  status?: string;
}

const supabaseAdmin = createSupabaseAdmin()

export async function POST(request: NextRequest) {
  console.log('\n🚀 === CHAT API INICIADA ===')
  
  try {
    // 1. VALIDAÇÃO INICIAL
    const body = await request.json()
    const { message, userId, action } = body

    console.log('📥 Request recebido:', { 
      hasMessage: !!message, 
      userId: userId?.substring(0, 8) + '...', 
      action 
    })

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    // 2. AÇÃO DE ENCERRAR CHAT
    if (action === 'close_chat') {
      try {
        await supabaseAdmin
          .from('chat_conversations')
          .update({
            status: 'closed',
            closed_by: userId,
            closed_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('status', 'active')

        return NextResponse.json({
          response: '✅ Chat encerrado com sucesso. Nova conversa iniciará na próxima mensagem.',
          context: { chat_closed: true }
        })
      } catch (error) {
        console.error('❌ Erro ao encerrar chat:', error)
        return NextResponse.json({ error: 'Erro ao encerrar chat' }, { status: 500 })
      }
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    // 3. VERIFICAR CONFIGURAÇÃO DO GEMINI
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      console.error('❌ GEMINI_API_KEY não configurada')
      return NextResponse.json({
        response: '❌ IA temporariamente indisponível. Verifique a configuração da API.',
        context: { error: true }
      })
    }

    // 4. BUSCAR PERFIL DO USUÁRIO
    console.log('👤 Buscando dados do usuário...')

    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // 5. BUSCA INTELIGENTE DE PRODUTOS BASEADA NA MENSAGEM
    let relevantProducts: Product[] = []
    const queryLower = message.toLowerCase()

    // Extrair termos de busca relevantes
    const searchTerms: string[] = queryLower
      .replace(/[^\w\sàáâãéêíóôõúç]/g, ' ')
      .split(/\s+/)
      .filter((term: string) => term.length > 2)

    console.log('🔍 Termos de busca extraídos:', searchTerms)

    // 6. BUSCA OTIMIZADA DIRETO NO BANCO (sem limit 50!)
    if (searchTerms.length > 0) {
      // Construir query com múltiplos termos de busca
      const searchQueries = searchTerms.map(term =>
        `name.ilike.%${term}%,description.ilike.%${term}%,code.ilike.%${term}%,category.ilike.%${term}%,brand.ilike.%${term}%`
      )

      // Buscar produtos relevantes usando OR
      const { data: searchResults } = await supabaseAdmin
        .from('products')
        .select('id, code, name, description, category, brand, unit, stock_quantity, min_stock, price, cost, supplier, location, status')
        .eq('user_id', userId)
        .or(searchQueries.join(','))
        .limit(1000) // Aumentado para 1000 produtos

      // Filtrar apenas produtos ativos
      relevantProducts = (searchResults || []).filter((p: any) =>
        !p.status || p.status === 'active' || p.status === 'ativo'
      )

      console.log('🎯 Produtos encontrados na busca:', relevantProducts.length)
    }

    // Se não encontrou produtos específicos, buscar amostra geral
    if (relevantProducts.length === 0) {
      const { data: sampleProducts } = await supabaseAdmin
        .from('products')
        .select('id, code, name, description, category, brand, unit, stock_quantity, min_stock, price, cost, supplier, location, status')
        .eq('user_id', userId)
        .or('status.eq.active,status.eq.ativo,status.is.null')
        .limit(200)

      relevantProducts = sampleProducts || []
      console.log('📦 Usando amostra geral:', relevantProducts.length)
    }

    // 7. BUSCAR ESTATÍSTICAS GERAIS DO ESTOQUE
    const { count: totalProducts } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .or('status.eq.active,status.eq.ativo,status.is.null')

    const { data: lowStockProducts } = await supabaseAdmin
      .from('products')
      .select('stock_quantity, min_stock')
      .eq('user_id', userId)
      .or('status.eq.active,status.eq.ativo,status.is.null')
      .lte('stock_quantity', 10)

    const products: Product[] = relevantProducts

    console.log('📊 Estatísticas:', {
      totalProducts,
      lowStock: lowStockProducts?.length || 0,
      relevantFound: relevantProducts.length
    })

    // 8. CALCULAR ESTATÍSTICAS
    const stats = {
      total: totalProducts || 0,
      lowStock: lowStockProducts?.length || 0,
      categories: [...new Set(products.map((p: Product) => p.category).filter(Boolean))],
      brands: [...new Set(products.map((p: Product) => p.brand).filter(Boolean))]
    }

    // 9. DETECTAR TIPO DE CONSULTA E AJUSTAR PRODUTOS
    let queryType = 'geral'

    if (/estoque.*baixo|baixo.*estoque/i.test(queryLower)) {
      queryType = 'estoque_baixo'
      // Buscar produtos com estoque baixo
      const { data: lowStock } = await supabaseAdmin
        .from('products')
        .select('id, code, name, description, category, brand, unit, stock_quantity, min_stock, price, cost, supplier, location, status')
        .eq('user_id', userId)
        .or('status.eq.active,status.eq.ativo,status.is.null')
        .lte('stock_quantity', 10)
        .limit(100)

      relevantProducts = lowStock || []
    } else if (/orçamento|orcamento|cotação|cotacao|proposta|preciso|quero comprar/i.test(queryLower)) {
      queryType = 'orcamento'
      // Manter produtos encontrados na busca
    } else if (/categoria|tipo/i.test(queryLower)) {
      queryType = 'categoria'
    } else if (/marca|fabricante/i.test(queryLower)) {
      queryType = 'marca'
    }

    console.log('📋 Tipo de consulta:', queryType, '| Produtos relevantes:', relevantProducts.length)

    // 10. PREPARAR CONTEXTO OTIMIZADO PARA A IA (reduzido!)
    const contextData = {
      empresa: userProfile?.company || 'Não informada',
      totalProdutos: stats.total,
      estoqueBaixo: stats.lowStock,
      tipoConsulta: queryType,
      // Limitar a 15 produtos para não estourar tokens
      produtosRelevantes: relevantProducts.slice(0, 15).map((p: Product) => ({
        nome: p.name,
        codigo: p.code || 'S/C',
        categoria: p.category || 'N/A',
        marca: p.brand || 'N/A',
        estoque: p.stock_quantity || 0,
        custo: p.cost || 0,  // FOCO NO CUSTO!
        unidade: p.unit || 'UN'
      }))
    }

    // 11. CRIAR PROMPT ESPECIALIZADO EM ORÇAMENTOS
    const systemPrompt = `Você é o AutoPanel IA, assistente especializado em CRIAR ORÇAMENTOS de materiais elétricos.

🎯 SUA MISSÃO: Ajudar vendedores a montar orçamentos RAPIDAMENTE.

📊 CONTEXTO DO ESTOQUE:
- Empresa: ${contextData.empresa}
- Total de produtos no sistema: ${contextData.totalProdutos}
- Produtos com estoque baixo: ${contextData.estoqueBaixo}
- Tipo de consulta: ${contextData.tipoConsulta}

📦 PRODUTOS ENCONTRADOS PARA ESTA CONSULTA (${contextData.produtosRelevantes.length}):
${contextData.produtosRelevantes.map((p, i) =>
`${i+1}. ${p.nome} (${p.codigo})
   Categoria: ${p.categoria} | Marca: ${p.marca}
   Estoque: ${p.estoque} ${p.unidade} | CUSTO: R$ ${p.custo.toFixed(2)}`
).join('\n')}

⚠️ REGRAS OBRIGATÓRIAS:

1. PARA ORÇAMENTOS:
   ${queryType === 'orcamento' ? `
   a) Se o usuário NÃO informou nome do cliente, PERGUNTE:
      - "Para montar o orçamento, preciso de alguns dados:"
      - "📝 Qual o nome do cliente?"
      - "🏢 Nome da empresa? (opcional)"
      - "📞 Telefone ou email para contato?"

   b) Se o usuário NÃO especificou produtos/quantidades, PERGUNTE:
      - "Quais produtos/materiais precisa?"
      - "Quantidades de cada item?"
      - "Alguma especificação técnica importante?"

   c) SEMPRE retorne valores em CUSTO (não preço de venda):
      - "Custo unitário: R$ X.XX"
      - "Custo total: R$ X.XX"
      - NUNCA calcule preço de venda

   d) Mostre disponibilidade em estoque:
      - "✅ Em estoque: X unidades"
      - "⚠️ Estoque baixo: X unidades"
      - "❌ Sem estoque no momento"

   e) Estruture a resposta assim:
      📋 ORÇAMENTO PARA: [Cliente] - [Empresa]
      📞 Contato: [telefone/email]

      📦 ITENS:
      1. [Produto] - Cód: [XXX]
         Qtd: [X] [un] x R$ [custo] = R$ [total]
         Estoque: [X] [un]

      💰 CUSTO TOTAL: R$ [XX.XX]

      ⚠️ Observação: Preço de venda a definir pelo vendedor.

   f) CRITÉRIO PARA ORÇAMENTO COMPLETO:
      ✅ Tem nome do cliente
      ✅ Tem pelo menos 1 produto com quantidade
      ✅ Tem valor total calculado

   g) SEMPRE que montar um orçamento COMPLETO, PERGUNTE:
      "\n\n✅ Está correto? Posso salvar este orçamento na aba Orçamentos?"

   h) Se o usuário responder: "sim", "pode", "confirmo", "salva", "perfeito", "ok":
      Responda EXATAMENTE: "SALVAR_ORCAMENTO:SIM"
      E mais nada!
   ` : ''}

2. PARA CONSULTAS GERAIS:
   - Liste produtos disponíveis
   - Mostre código, estoque e CUSTO
   - Seja objetivo (máx 500 caracteres)

3. NÃO INVENTE DADOS:
   - Use APENAS produtos da lista acima
   - Se não encontrou o produto, diga isso
   - Se estoque for 0, informe que está sem estoque

4. FORMATAÇÃO:
   - Use R$ para valores
   - Seja direto e profissional
   - Use emojis apenas: ✅ ⚠️ ❌

CONSULTA DO VENDEDOR: "${message}"`

    // 12. CHAMAR GEMINI COM TIMEOUT
    try {
      console.log('🤖 Chamando Gemini...')

      const genAI = new GoogleGenerativeAI(geminiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp', // Modelo mais recente e poderoso
        generationConfig: {
          temperature: 0.2, // Mais determinístico para orçamentos
          topP: 0.8,
          maxOutputTokens: queryType === 'orcamento' ? 1500 : 800 // Mais espaço para orçamentos detalhados
        }
      })

      // Implementar timeout robusto
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 segundos

      const geminiPromise = model.generateContent(systemPrompt)
      
      const result = await Promise.race([
        geminiPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 25000)
        )
      ]) as any

      clearTimeout(timeoutId)

      const response = result.response.text()
      console.log('✅ Resposta recebida do Gemini:', { length: response.length })

      // 13. GERENCIAR CONVERSA ATIVA (precisa estar antes do salvamento)
      const conversationId = await manageActiveConversation(userId, message)

      // 14. DETECTAR SE DEVE SALVAR ORÇAMENTO
      let quoteSaved = false
      let quoteNumber = null

      // Detectar comando direto para salvar
      const commandToSave = /\b(salva|salvar|salve|grave)\b.*\b(orçamento|orcamento)\b/i.test(message.toLowerCase())

      // Detectar confirmação do usuário após pergunta da IA
      const userConfirmed = /\b(sim|pode|confirmo|perfeito|ok|yes|correto|certo)\b/i.test(message.toLowerCase())

      if (response.includes('SALVAR_ORCAMENTO:SIM') || commandToSave || (userConfirmed && conversationId)) {
        console.log('💾 Detectado comando para salvar orçamento...')

        try {
          // Extrair dados da conversa (mensagens anteriores)
          const { data: conversationMessages } = await supabaseAdmin
            .from('chat_messages')
            .select('content, role')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10)

          // Buscar dados do orçamento nas mensagens
          let customerName = ''
          let customerCompany = ''
          let customerContact = ''
          let items: any[] = []
          let totalCost = 0

          // Buscar dados do cliente nas mensagens do usuário
          for (const msg of conversationMessages || []) {
            if (msg.role === 'user' && !customerName) {
              // Tentar extrair nome, empresa e telefone da mensagem do usuário
              const userMsg = msg.content.toLowerCase()

              // Buscar padrões de telefone
              const phoneMatch = msg.content.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/);
              if (phoneMatch) customerContact = phoneMatch[1]

              // Buscar nome (primeira palavra que não seja número ou comando)
              const words = msg.content.split(/\s+/).filter((w: string) => w.length > 2 && !/^\d+$/.test(w))
              if (words.length > 0 && !customerName) {
                // Pegar primeiras 2-3 palavras como possível nome
                const possibleName = words.slice(0, 2).join(' ')
                if (!/\b(preciso|quero|favor|gostaria|orçamento)\b/i.test(possibleName)) {
                  customerName = possibleName
                }
              }
            }

            // Buscar dados formatados da IA
            if (msg.role === 'assistant') {
              // Formato estruturado
              if (msg.content.includes('ORÇAMENTO PARA:') || msg.content.includes('📋')) {
                const nameMatch = msg.content.match(/(?:ORÇAMENTO PARA:|📋)[:\s]*([^\-\n]+?)(?:\s*-\s*|\n)/i)
                const companyMatch = msg.content.match(/(?:ORÇAMENTO PARA:|📋)[^\-]+-\s*([^\n]+)/)
                const contactMatch = msg.content.match(/(?:Contato:|📞)[:\s]*([^\n]+)/)

                if (nameMatch) customerName = nameMatch[1].trim()
                if (companyMatch) customerCompany = companyMatch[1].trim()
                if (contactMatch) customerContact = contactMatch[1].trim()
              }

              // Buscar TOTAL
              const totalMatch = msg.content.match(/(?:TOTAL|CUSTO TOTAL|💰)[:\s]*R\$\s*([\d.,]+)/i)
              if (totalMatch) {
                totalCost = parseFloat(totalMatch[1].replace(/\./g, '').replace(',', '.'))
              }

              // Extrair itens (múltiplos formatos)
              // Formato 1: "Produto: 5 x R$ 10.00 = R$ 50.00"
              const itemsFormat1 = msg.content.match(/([^:\n]+?):\s*(\d+)\s*x\s*R\$\s*([\d.,]+)\s*=\s*R\$\s*([\d.,]+)/gi)
              if (itemsFormat1 && items.length === 0) {
                items = itemsFormat1.map((item: string) => {
                  const match = item.match(/([^:\n]+?):\s*(\d+)\s*x\s*R\$\s*([\d.,]+)\s*=\s*R\$\s*([\d.,]+)/i)
                  if (match) {
                    return {
                      product_name: match[1].trim(),
                      code: 'AUTO',
                      quantity: parseInt(match[2]),
                      unit_price: parseFloat(match[3].replace(',', '.'))
                    }
                  }
                  return null
                }).filter(Boolean)
              }

              // Formato 2: "1. Produto - Cód: XXX Qtd: 5 un x R$ 10.00"
              const itemsFormat2 = msg.content.match(/\d+\.\s+(.+?)\s*(?:-\s*Cód:\s*(\S+))?\s*[\s\S]*?(?:Qtd:|Quantidade:)?\s*(\d+)[^\d]*x\s*R\$\s*([\d.,]+)/gi)
              if (itemsFormat2 && items.length === 0) {
                items = itemsFormat2.map((item: string) => {
                  const match = item.match(/\d+\.\s+(.+?)\s*(?:-\s*Cód:\s*(\S+))?\s*[\s\S]*?(?:Qtd:|Quantidade:)?\s*(\d+)[^\d]*x\s*R\$\s*([\d.,]+)/i)
                  if (match) {
                    return {
                      product_name: match[1].trim(),
                      code: match[2] || 'AUTO',
                      quantity: parseInt(match[3]),
                      unit_price: parseFloat(match[4].replace(',', '.'))
                    }
                  }
                  return null
                }).filter(Boolean)
              }
            }
          }

          console.log('📝 Dados extraídos:', {
            customerName,
            customerCompany,
            customerContact,
            totalCost,
            itemsCount: items.length
          })

          // Se encontrou dados, salvar orçamento
          if (customerName && items.length > 0) {
            // Gerar número do orçamento
            const now = new Date()
            quoteNumber = `ORC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

            console.log('💾 Salvando orçamento:', { quoteNumber, customerName, total: totalCost, items: items.length })

            // Salvar orçamento
            const { data: quoteData, error: quoteError } = await supabaseAdmin
              .from('quotes')
              .insert({
                user_id: userId,
                quote_number: quoteNumber,
                customer_name: customerName,
                customer_company: customerCompany || null,
                customer_phone: customerContact || null,
                customer_email: customerContact?.includes('@') ? customerContact : null,
                total_amount: totalCost,
                value: totalCost,
                status: 'draft',
                created_from_chat: true,
                chat_conversation_id: conversationId || null,
                notes: 'Orçamento criado automaticamente pelo Chat IA'
              })
              .select()
              .single()

            if (quoteError) throw quoteError

            // Salvar itens do orçamento
            if (quoteData && items.length > 0) {
              const quoteItems = items.map(item => ({
                quote_id: quoteData.id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.quantity * item.unit_price
              }))

              await supabaseAdmin
                .from('quote_items')
                .insert(quoteItems)
            }

            quoteSaved = true
            console.log('✅ Orçamento salvo:', quoteNumber)
          }
        } catch (saveError) {
          console.error('❌ Erro ao salvar orçamento:', saveError)
        }
      }

      // 15. SALVAR MENSAGENS (não crítico)
      try {
        await supabaseAdmin.from('chat_messages').insert([
          {
            conversation_id: conversationId,
            user_id: userId,
            role: 'user',
            content: message
          },
          {
            conversation_id: conversationId,
            user_id: userId,
            role: 'assistant',
            content: response
          }
        ])
      } catch (saveError) {
        console.warn('⚠️ Erro ao salvar conversa (não crítico):', saveError)
      }

      // 16. PREPARAR RESPOSTA FINAL
      let finalResponse = response

      // Se orçamento foi salvo, substituir a confirmação por mensagem amigável
      if (quoteSaved && quoteNumber) {
        finalResponse = finalResponse.replace('SALVAR_ORCAMENTO:SIM',
          `✅ **Orçamento ${quoteNumber} salvo com sucesso!**\n\n` +
          `Você pode visualizar e editar este orçamento na aba "Orçamentos" do dashboard.\n\n` +
          `O orçamento está salvo como rascunho e pode ser enviado ao cliente quando estiver pronto.`
        )
      }

      // 17. RESPOSTA FINAL
      return NextResponse.json({
        response: finalResponse,
        context: {
          total_products: stats.total,
          low_stock_items: stats.lowStock,
          relevant_products: relevantProducts.length,
          query_type: queryType,
          has_products: stats.total > 0,
          user_company: contextData.empresa,
          conversation_id: conversationId,
          conversation_active: true,
          quote_created: quoteSaved ? quoteNumber : null
        }
      })

    } catch (geminiError: any) {
      console.error('❌ Erro no Gemini:', geminiError)
      
      let aiResponse = '❌ Erro na IA. '
      
      if (geminiError.message === 'GEMINI_TIMEOUT') {
        aiResponse += 'Timeout - muitos produtos para processar. Tente uma consulta mais específica.'
      } else if (geminiError.message?.includes('API key')) {
        aiResponse += 'Chave da API inválida.'
      } else if (geminiError.message?.includes('quota')) {
        aiResponse += 'Limite de uso atingido.'
      } else {
        aiResponse += 'Tente novamente em alguns segundos.'
      }

      // Resposta de fallback com dados do estoque
      if (stats.total > 0) {
        aiResponse += `\n\n📊 DADOS DO SEU ESTOQUE:
• Total: ${stats.total} produtos
• Estoque baixo: ${stats.lowStock} itens
• Categorias: ${stats.categories.slice(0, 3).join(', ')}
• Marcas: ${stats.brands.slice(0, 3).join(', ')}`
      }

      return NextResponse.json({
        response: aiResponse,
        context: {
          total_products: stats.total,
          low_stock_items: stats.lowStock,
          error: true
        }
      })
    }

  } catch (error: any) {
    console.error('❌ ERRO GERAL NA API:', error)
    
    return NextResponse.json({
      response: `❌ Erro interno: ${error.message || 'Desconhecido'}. Tente novamente.`,
      context: { error: true }
    }, { status: 500 })
  }
}

// FUNÇÃO AUXILIAR PARA GERENCIAR CONVERSAS
async function manageActiveConversation(userId: string, message: string): Promise<string> {
  try {
    const { data: activeConversation } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single()

    if (activeConversation) {
      // Atualizar conversa existente
      await supabaseAdmin
        .from('chat_conversations')
        .update({
          last_message: message.substring(0, 255), // Limitar tamanho
          last_message_at: new Date().toISOString()
        })
        .eq('id', activeConversation.id)
      
      return activeConversation.conversation_id
    } else {
      // Criar nova conversa
      const conversationId = `conv_${userId.substring(0, 8)}_${Date.now()}`
      
      await supabaseAdmin
        .from('chat_conversations')
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          status: 'active',
          last_message: message.substring(0, 255),
          last_message_at: new Date().toISOString()
        })

      return conversationId
    }
  } catch (error) {
    console.warn('⚠️ Erro ao gerenciar conversa:', error)
    return `conv_fallback_${Date.now()}`
  }
}