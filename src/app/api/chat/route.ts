import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

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

    // 4. BUSCAR DADOS BÁSICOS DO USUÁRIO
    console.log('👤 Buscando dados do usuário...')
    
    const [profileResult, productsResult] = await Promise.allSettled([
      supabaseAdmin.from('profiles').select('*').eq('id', userId).single(),
      supabaseAdmin.from('products')
        .select('id, code, name, description, category, brand, unit, stock_quantity, min_stock, price, cost, supplier, location, status')
        .eq('user_id', userId)
        .limit(50) // Limitar para evitar timeout
    ])

    const userProfile = profileResult.status === 'fulfilled' ? profileResult.value.data : null
    const allProducts = productsResult.status === 'fulfilled' ? (productsResult.value.data || []) : []
    
    // Filtrar produtos ativos - tipando explicitamente
    const products: Product[] = allProducts.filter((p: any) => 
      !p.status || p.status === 'active' || p.status === 'ativo'
    )

    console.log('📊 Dados carregados:', { 
      profile: !!userProfile,
      totalProducts: allProducts.length,
      activeProducts: products.length
    })

    // 5. BUSCA INTELIGENTE DE PRODUTOS BASEADA NA MENSAGEM
    let relevantProducts: Product[] = []
    const queryLower = message.toLowerCase()
    
    // Detectar termos relevantes - com tipagem explícita
    const searchTerms: string[] = queryLower
      .replace(/[^\w\sàáâãéêíóôõúç]/g, ' ')
      .split(/\s+/)
      .filter((term: string) => term.length > 2)
    
    console.log('🔍 Termos de busca extraídos:', searchTerms)

    if (searchTerms.length > 0) {
      // Buscar produtos que correspondem aos termos - com tipagem explícita
      relevantProducts = products.filter((product: Product) => {
        const productText = `${product.name} ${product.description || ''} ${product.category || ''} ${product.brand || ''} ${product.code || ''}`.toLowerCase()
        
        return searchTerms.some((term: string) => 
          productText.includes(term) ||
          term.includes(product.name?.toLowerCase() || '') ||
          (product.code && product.code.toLowerCase().includes(term))
        )
      }).slice(0, 20) // Máximo 20 produtos relevantes
    }

    // Se não encontrou produtos específicos, pegar uma amostra
    if (relevantProducts.length === 0) {
      relevantProducts = products.slice(0, 10)
    }

    console.log('🎯 Produtos relevantes encontrados:', relevantProducts.length)

    // 6. CALCULAR ESTATÍSTICAS
    const stats = {
      total: products.length,
      lowStock: products.filter((p: Product) => (p.stock_quantity || 0) <= (p.min_stock || 0)).length,
      categories: [...new Set(products.map((p: Product) => p.category).filter(Boolean))],
      brands: [...new Set(products.map((p: Product) => p.brand).filter(Boolean))]
    }

    // 7. DETECTAR TIPO DE CONSULTA
    let queryType = 'geral'
    if (/estoque.*baixo|baixo.*estoque/i.test(queryLower)) {
      queryType = 'estoque_baixo'
      relevantProducts = products.filter((p: Product) => (p.stock_quantity || 0) <= (p.min_stock || 0)).slice(0, 15)
    } else if (/orçamento|orcamento|cotação|cotacao|proposta/i.test(queryLower)) {
      queryType = 'orçamento'
    } else if (/categoria|tipo/i.test(queryLower)) {
      queryType = 'categoria'
    } else if (/marca|fabricante/i.test(queryLower)) {
      queryType = 'marca'
    }

    console.log('📋 Tipo de consulta:', queryType)

    // 8. PREPARAR CONTEXTO PARA A IA
    const contextData = {
      empresa: userProfile?.company || 'Não informada',
      totalProdutos: stats.total,
      estoqueBaixo: stats.lowStock,
      categorias: stats.categories.slice(0, 10),
      marcas: stats.brands.slice(0, 10),
      tipoConsulta: queryType,
      produtosRelevantes: relevantProducts.map((p: Product) => ({
        nome: p.name,
        codigo: p.code || 'S/C',
        categoria: p.category || 'N/A',
        marca: p.brand || 'N/A',
        estoque: p.stock_quantity || 0,
        estoqueMinimo: p.min_stock || 0,
        preco: p.price || 0,
        custo: p.cost || 0,
        unidade: p.unit || 'UN',
        local: p.location || 'N/A'
      }))
    }

    // 9. CRIAR PROMPT ESPECIALIZADO
    const systemPrompt = `Você é o AutoPanel IA, assistente especializado em estoque elétrico.

DADOS DA CONSULTA:
- Empresa: ${contextData.empresa}
- Total de produtos: ${contextData.totalProdutos}
- Produtos com estoque baixo: ${contextData.estoqueBaixo}
- Tipo de consulta: ${contextData.tipoConsulta}

PRODUTOS RELEVANTES ENCONTRADOS:
${contextData.produtosRelevantes.map((p, i) => 
`${i+1}. ${p.nome} (${p.codigo})
   • Categoria: ${p.categoria} | Marca: ${p.marca}
   • Estoque: ${p.estoque} ${p.unidade} ${p.estoque <= p.estoqueMinimo ? '⚠️ BAIXO' : '✅'}
   • Custo: R$ ${p.custo.toFixed(2)} | Preço: R$ ${p.preco.toFixed(2)}
   • Local: ${p.local}`
).join('\n\n')}

INSTRUÇÕES:
- Responda APENAS sobre produtos elétricos e materiais elétricos
- Use os produtos listados acima como base para suas respostas
- Para orçamentos, extraia dados reais do cliente se mencionados
- Destaque produtos com estoque baixo usando ⚠️
- Use valores em formato brasileiro (R$)
- Seja direto e técnico
- Máximo 500 caracteres para consultas simples
- Para orçamentos pode usar até 800 caracteres

CONSULTA DO USUÁRIO: "${message}"`

    // 10. CHAMAR GEMINI COM TIMEOUT
    try {
      console.log('🤖 Chamando Gemini...')
      
      const genAI = new GoogleGenerativeAI(geminiKey)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: queryType === 'orçamento' ? 800 : 500
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

      // 11. GERENCIAR CONVERSA ATIVA
      const conversationId = await manageActiveConversation(userId, message)

      // 12. SALVAR MENSAGENS (não crítico)
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

      // 13. RESPOSTA FINAL
      return NextResponse.json({
        response,
        context: {
          total_products: stats.total,
          low_stock_items: stats.lowStock,
          relevant_products: relevantProducts.length,
          query_type: queryType,
          has_products: stats.total > 0,
          user_company: contextData.empresa,
          conversation_id: conversationId,
          conversation_active: true
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