// src/lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai'

// Usar apenas a variável do servidor
const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('AVISO: GEMINI_API_KEY não encontrada nas variáveis de ambiente.')
}

const genAI = new GoogleGenerativeAI(apiKey)

// Configurações otimizadas
const DEFAULT_CONFIG = {
  temperature: 0.3,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 800, // Reduzido para evitar timeouts
}

// Modelo correto
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash', // Corrigido o nome do modelo
  generationConfig: DEFAULT_CONFIG
})

// Função otimizada para gerar respostas
export const generateResponse = async (prompt, context = {}, config = {}) => {
  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: finalConfig
    })

    // Limitar tamanho do prompt
    let fullPrompt = prompt
    if (context && Object.keys(context).length > 0) {
      const contextStr = JSON.stringify(context, null, 2)
      if (contextStr.length > 5000) {
        // Truncar contexto muito grande
        fullPrompt = `${prompt}\n\nContexto (resumido): ${contextStr.substring(0, 5000)}...`
      } else {
        fullPrompt = `${prompt}\n\nContexto:\n${contextStr}`
      }
    }

    console.log('📤 Enviando para Gemini:', { 
      promptLength: fullPrompt.length,
      model: 'gemini-1.5-flash'
    })
    
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    console.log('📥 Resposta do Gemini:', { responseLength: text.length })
    
    return text

  } catch (error) {
    console.error('❌ Erro no Gemini:', error)
    
    // Tratamento específico melhorado
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid API key')) {
      throw new Error('Chave da API do Gemini inválida')
    }
    
    if (error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('quota')) {
      throw new Error('Cota da API do Gemini excedida')
    }
    
    if (error.message?.includes('BLOCKED') || error.message?.includes('safety')) {
      throw new Error('Conteúdo bloqueado pelo filtro de segurança')
    }
    
    if (error.message?.includes('RECITATION')) {
      throw new Error('Possível violação de direitos autorais detectada')
    }

    if (error.message?.includes('timeout') || error.message?.includes('TIMEOUT')) {
      throw new Error('Timeout na API do Gemini - tente novamente')
    }
    
    // Erro genérico com mais detalhes
    throw new Error(`Erro na IA: ${error.message || 'Erro desconhecido'}`)
  }
}

// Teste de conexão melhorado
export const testConnection = async () => {
  try {
    const response = await generateResponse('Responda apenas: OK', {}, { maxOutputTokens: 10 })
    return response.toLowerCase().includes('ok')
  } catch (error) {
    console.error('❌ Teste de conexão falhou:', error)
    return false
  }
}

export { genAI }