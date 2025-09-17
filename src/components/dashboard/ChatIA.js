'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Package, 
  AlertTriangle,
  RefreshCw,
  X,
  Minimize2,
  Maximize2,
  FileText,
  CheckCircle,
  ExternalLink,
  StopCircle,
  Play,
  Clock
} from 'lucide-react'

export default function ChatIA() {
  const [messages, setMessages] = useState([
    {
      id: `msg_${Date.now()}_0`,
      role: 'assistant',
      content: 'Olá! Sou o AutoPanel IA, seu assistente para orçamentos. Como posso ajudar você hoje?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [stockStats, setStockStats] = useState({ total: 0, lowStock: 0 })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const [quoteCreated, setQuoteCreated] = useState(null)
  
  // 🆕 Novos estados para conversas persistentes
  const [conversationActive, setConversationActive] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [lastMessage, setLastMessage] = useState('')
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messageIdCounter = useRef(1)
  const messagesContainerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  // Effect para marcar componente como montado
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (isMounted) {
      getUser()
      getStockStats()
      checkActiveConversation() // 🆕 Verificar conversa ativa
    }
  }, [isMounted])

  // Scroll inteligente - só rola se não estiver scrollando manualmente
  useEffect(() => {
    if (isMounted && !isUserScrolling) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, isMounted, isUserScrolling])

  // Detectar scroll manual do usuário
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsUserScrolling(true)
      
      // Clear timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Depois de 2 segundos sem scroll, permite scroll automático novamente
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false)
      }, 2000)

      // Se chegou no final, permite scroll automático
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setIsUserScrolling(false)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const getUser = useCallback(async () => {
    if (!isMounted) return
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (isMounted) {
        setUser(user)
        console.log('Usuário logado:', { id: user?.id, email: user?.email })
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      if (isMounted) {
        setUser(null)
      }
    }
  }, [isMounted])

  const getStockStats = useCallback(async () => {
    if (!isMounted) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      console.log('Buscando estatísticas para usuário:', user.id)

      const { data: products, error } = await supabase
        .from('products')
        .select('stock_quantity, min_stock')
        .eq('user_id', user.id)

      console.log('Produtos encontrados (stats):', { count: products?.length, error })

      if (error) throw error
      if (!isMounted) return

      const total = products?.length || 0
      const lowStock = products?.filter(p => (p.stock_quantity || 0) <= (p.min_stock || 0)).length || 0

      setStockStats({ total, lowStock })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      if (isMounted) {
        setStockStats({ total: 0, lowStock: 0 })
      }
    }
  }, [isMounted])

  // 🆕 Verificar se há conversa ativa
  const checkActiveConversation = useCallback(async () => {
    if (!isMounted) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar conversa ativa:', error)
        return
      }

      if (conversation && isMounted) {
        setConversationActive(true)
        setConversationId(conversation.conversation_id)
        setLastMessage(conversation.last_message || '')
        console.log('🔄 Conversa ativa encontrada:', conversation.conversation_id)
        
        // Carregar mensagens da conversa
        await loadConversationMessages(conversation.conversation_id)
      } else {
        setConversationActive(false)
        setConversationId(null)
        setLastMessage('')
      }
    } catch (error) {
      console.error('Erro ao verificar conversa ativa:', error)
    }
  }, [isMounted])

  // 🆕 Carregar mensagens da conversa ativa
  const loadConversationMessages = useCallback(async (convId) => {
    if (!isMounted) return
    
    try {
      const { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (chatMessages && chatMessages.length > 0 && isMounted) {
        const formattedMessages = chatMessages.map((msg, index) => ({
          id: `msg_${Date.now()}_${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
          context: msg.metadata
        }))

        setMessages(formattedMessages)
        console.log('📜 Mensagens carregadas:', formattedMessages.length)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }, [isMounted])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && isMounted && !isUserScrolling) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      } catch (error) {
        // Ignora erros de scroll
      }
    }
  }, [isMounted, isUserScrolling])

  // ✅ FUNÇÃO handleSubmit CORRIGIDA
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading || !isMounted) return

    const messageId = `msg_${Date.now()}_${messageIdCounter.current++}`
    const userMessage = {
      id: messageId,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setQuoteCreated(null)
    setIsUserScrolling(false)

    try {
      // Buscar usuário atual
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        throw new Error('Usuário não autenticado')
      }

      if (!isMounted) return

      console.log('📤 Enviando mensagem:', { 
        message: userMessage.content.substring(0, 50) + '...', 
        userId: currentUser.id 
      })

      // Fazer requisição com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: currentUser.id
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📥 Response status:', response.status)

      // Tratamento de diferentes status HTTP
      if (!response.ok) {
        let errorMsg = 'Erro desconhecido'
        
        try {
          const errorData = await response.text()
          const parsedError = JSON.parse(errorData)
          errorMsg = parsedError.error || errorMsg
        } catch (parseError) {
          // Se não conseguir fazer parse, usar mensagens padrão
          switch (response.status) {
            case 401:
              errorMsg = 'Sessão expirada. Faça login novamente.'
              break
            case 429:
              errorMsg = 'Muitas requisições. Aguarde um momento.'
              break
            case 500:
              errorMsg = 'Erro interno do servidor. Tente novamente.'
              break
            case 503:
              errorMsg = 'Serviço temporariamente indisponível.'
              break
            default:
              errorMsg = `Erro ${response.status}: ${response.statusText}`
          }
        }
        
        throw new Error(errorMsg)
      }

      if (!isMounted) return

      // Parse da resposta
      const responseText = await response.text()
      console.log('📄 Response text length:', responseText.length)
      
      if (!responseText.trim()) {
        throw new Error('Resposta vazia do servidor')
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse da resposta:', parseError)
        throw new Error('Resposta inválida do servidor')
      }

      console.log('✅ Dados recebidos:', { 
        hasResponse: !!data.response, 
        hasContext: !!data.context 
      })

      // Verificar se tem resposta válida
      if (!data.response || typeof data.response !== 'string') {
        throw new Error('Resposta da IA está vazia ou inválida')
      }

      // Criar mensagem do assistente
      const assistantMessageId = `msg_${Date.now()}_${messageIdCounter.current++}`
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        context: data.context
      }

      setMessages(prev => [...prev, assistantMessage])

      // Atualizar contexto da conversa
      if (data.context?.conversation_id) {
        setConversationId(data.context.conversation_id)
        setConversationActive(data.context.conversation_active || false)
        setLastMessage(userMessage.content)
      }

      // Verificar orçamento criado
      if (data.context?.quote_created) {
        setQuoteCreated(data.context.quote_created)
        console.log('✅ Orçamento criado:', data.context.quote_created)
      }

      // Atualizar estatísticas
      if (data.context && isMounted) {
        setStockStats({
          total: data.context.total_products || 0,
          lowStock: data.context.low_stock_items || 0
        })
      }

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
      
      if (!isMounted) return

      let errorMsg = 'Erro desconhecido'
      
      // Tratar diferentes tipos de erro
      if (error.name === 'AbortError') {
        errorMsg = 'Timeout: A IA demorou para responder. Tente novamente.'
      } else if (error.message?.includes('Failed to fetch')) {
        errorMsg = 'Erro de conexão. Verifique sua internet.'
      } else if (error.message?.includes('NetworkError')) {
        errorMsg = 'Erro de rede. Tente novamente.'
      } else {
        errorMsg = error.message || 'Erro interno. Tente novamente.'
      }

      const errorMessageId = `msg_${Date.now()}_${messageIdCounter.current++}`
      const errorMessageObj = {  // ✅ NOME CORRIGIDO
        id: errorMessageId,
        role: 'assistant',
        content: `❌ ${errorMsg}`,
        timestamp: new Date().toISOString(),
        isError: true
      }

      setMessages(prev => [...prev, errorMessageObj])  // ✅ USA O NOME CORRETO
      
    } finally {
      if (isMounted) {
        setIsLoading(false)
        setTimeout(() => {
          if (inputRef.current && isMounted) {
            try {
              inputRef.current.focus()
            } catch (focusError) {
              // Ignora erros de focus
            }
          }
        }, 100)
      }
    }
  }, [inputMessage, isLoading, isMounted])

  // 🆕 Função para encerrar chat
  const handleCloseChat = useCallback(async () => {
    if (!isMounted || !conversationActive) return

    setShowCloseConfirm(false)
    setIsLoading(true)

    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        throw new Error('Usuário não autenticado')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          action: 'close_chat'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao encerrar chat')
      }

      const data = await response.json()

      // Atualizar estado
      setConversationActive(false)
      setConversationId(null)
      setLastMessage('')

      // Adicionar mensagem de confirmação
      const confirmationMessageId = `msg_${Date.now()}_${messageIdCounter.current++}`
      const confirmationMessage = {
        id: confirmationMessageId,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        isSystem: true
      }

      setMessages(prev => [...prev, confirmationMessage])

      console.log('✅ Chat encerrado com sucesso')

    } catch (error) {
      console.error('Erro ao encerrar chat:', error)
      
      const errorMessageId = `msg_${Date.now()}_${messageIdCounter.current++}`
      const errorMsg = {
        id: errorMessageId,
        role: 'assistant',
        content: `Erro ao encerrar chat: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      }

      setMessages(prev => [...prev, errorMsg])
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }
  }, [isMounted, conversationActive])

  const handleClearChat = useCallback(() => {
    if (!isMounted) return
    
    if (confirm('Deseja limpar o histórico do chat?')) {
      const initialMessageId = `msg_${Date.now()}_${messageIdCounter.current++}`
      setMessages([
        {
          id: initialMessageId,
          role: 'assistant',
          content: 'Chat limpo! Como posso ajudar você agora?',
          timestamp: new Date().toISOString()
        }
      ])
      setIsUserScrolling(false)
      setQuoteCreated(null)
      // Não limpar conversa ativa - apenas o visual
    }
  }, [isMounted])

  const formatTime = useCallback((timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '--:--'
    }
  }, [])

  const toggleExpanded = useCallback(() => {
    if (isMounted) {
      setIsExpanded(!isExpanded)
    }
  }, [isExpanded, isMounted])

  // Função para ir para a aba de orçamentos
  const goToQuotes = useCallback(() => {
    window.location.href = '/dashboard/orcamentos'
  }, [])

  const suggestedQuestions = [
    'Mostrar produtos com estoque baixo',
    'Buscar produtos disponíveis',
    'Orçamentos',
    'Listar produtos por categoria',
    'Mostrar itens sem fornecedor'
  ]

  // Não renderizar até o componente estar montado
  if (!isMounted) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 h-96">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 transition-all duration-300 ${
      isExpanded 
        ? 'fixed inset-4 z-50 h-auto max-h-[calc(100vh-2rem)]' 
        : 'h-auto max-h-[600px]'
    }`}>
      {/* Header do Chat */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            conversationActive 
              ? 'bg-gradient-to-r from-green-600 to-green-700' 
              : 'bg-gradient-to-r from-orange-600 to-orange-700'
          }`}>
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">AutoPanel IA</h3>
              {conversationActive && (
                <span className="flex items-center text-xs text-green-400">
                  <Play className="w-3 h-3 mr-1" />
                  <span className="hidden xs:inline">Ativa</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center">
                <Package className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">{stockStats.total} produtos</span>
                <span className="xs:hidden">{stockStats.total}</span>
              </span>
              {stockStats.lowStock > 0 && (
                <span className="flex items-center text-yellow-400">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  <span className="hidden xs:inline">{stockStats.lowStock} baixo</span>
                  <span className="xs:hidden">{stockStats.lowStock}</span>
                </span>
              )}
              {conversationActive && lastMessage && (
                <span className="flex items-center text-blue-400 truncate max-w-20">
                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate text-xs">{lastMessage.substring(0, 15)}...</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* 🆕 Botão para encerrar chat */}
          {conversationActive && (
            <button
              onClick={() => setShowCloseConfirm(true)}
              className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="Encerrar conversa ativa"
              type="button"
            >
              <StopCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          
          <button
            onClick={() => getStockStats()}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Atualizar dados"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          <button
            onClick={handleClearChat}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Limpar chat"
            type="button"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={toggleExpanded}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title={isExpanded ? "Minimizar" : "Expandir"}
            type="button"
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 🆕 Status da Conversa */}
      {conversationActive && (
        <div className="bg-green-600 bg-opacity-10 border-b border-green-600 border-opacity-20 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-400">
              <Play className="w-4 h-4 mr-2" />
              <span>Conversa ativa - ID: {conversationId?.substring(-8)}</span>
            </div>
            <span className="text-green-300 text-xs">Esta conversa será salva até você encerrá-la</span>
          </div>
        </div>
      )}

      {/* Notificação de Orçamento Criado */}
      {quoteCreated && (
        <div className="bg-green-600 bg-opacity-20 border-b border-green-600 border-opacity-30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-green-300 font-semibold">Orçamento {quoteCreated} criado!</p>
                <p className="text-green-400 text-sm">Salvo automaticamente na aba Orçamentos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToQuotes}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors flex items-center"
                type="button"
              >
                <FileText className="w-3 h-3 mr-1" />
                Ver Orçamento
                <ExternalLink className="w-3 h-3 ml-1" />
              </button>
              <button
                onClick={() => setQuoteCreated(null)}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Área de Mensagens */}
      <div 
        ref={messagesContainerRef}
        className={`p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 ${
          isExpanded 
            ? 'h-[calc(100vh-12rem)]' 
            : 'h-64 sm:h-80 lg:h-96'
        }`}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-sm lg:max-w-md xl:max-w-lg ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              
              {/* Avatar */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : message.isError 
                  ? 'bg-red-600' 
                  : message.isSystem
                  ? 'bg-gray-600'
                  : 'bg-gradient-to-r from-orange-600 to-orange-700'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                )}
              </div>

              {/* Mensagem */}
              <div className={`rounded-lg p-2.5 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.isError
                  ? 'bg-red-600/20 text-red-300 border border-red-600/30'
                  : message.isSystem
                  ? 'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">
                  {message.content}
                </p>
                <p className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-gray-700 rounded-lg p-2.5 sm:p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-orange-500" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    {conversationActive ? 'Continuando conversa...' : 'Processando orçamento...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões de Perguntas */}
      {messages.length === 1 && !conversationActive && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <p className="text-xs text-gray-400 mb-2 sm:mb-3">Sugestões:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={`suggestion_${index}`}
                onClick={() => setInputMessage(question)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input de Mensagem */}
      <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={conversationActive ? "Continue a conversa..." : "Digite seu orçamento..."}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Enviar</span>
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 hidden sm:block">
          {conversationActive 
            ? "🟢 Conversa ativa - suas mensagens serão salvas até você encerrá-la"
            : "💡 Exemplo: \"Orçamento para João Silva - 10 disjuntores DR 20A + 5 cabos flexível 2.5mm\""
          }
        </p>
      </div>

      {/* 🆕 Modal de Confirmação para Encerrar Chat */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-600 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <StopCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Encerrar Conversa</h3>
                  <p className="text-sm text-gray-400">Tem certeza que deseja encerrar a conversa ativa?</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-300">
                  ⚠️ Ao encerrar, uma nova conversa será iniciada na próxima mensagem. 
                  As mensagens atuais permanecerão salvas no histórico.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCloseChat}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Encerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}