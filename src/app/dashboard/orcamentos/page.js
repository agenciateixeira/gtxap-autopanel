'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit2, 
  Trash2,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  X,
  User,
  Building,
  Phone,
  Mail,
  ShoppingCart,
  MessageSquare,
  Bot,
  ExternalLink,
  Archive,
  AlertTriangle,
  Copy,
  FileDown,
  Printer
} from 'lucide-react'

export default function OrcamentosPage() {
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showConversationModal, setShowConversationModal] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversationMessages, setConversationMessages] = useState([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingQuote, setViewingQuote] = useState(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    quote_number: '',
    items: [{ product_name: '', quantity: 1, unit_price: 0, total: 0 }],
    total_amount: 0,
    discount: 0,
    notes: '',
    valid_until: ''
  })

  const statusOptions = {
    'draft': { label: 'Rascunho', color: 'bg-gray-500/20 text-gray-300 border-gray-500/20', icon: Clock },
    'sent': { label: 'Enviado', color: 'bg-blue-500/20 text-blue-300 border-blue-500/20', icon: Send },
    'approved': { label: 'Aprovado', color: 'bg-green-500/20 text-green-300 border-green-500/20', icon: CheckCircle },
    'rejected': { label: 'Rejeitado', color: 'bg-red-500/20 text-red-300 border-red-500/20', icon: XCircle },
    'expired': { label: 'Expirado', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20', icon: Clock }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  useEffect(() => {
    filterQuotes()
  }, [quotes, searchTerm, statusFilter, dateFilter, sourceFilter])

  const fetchQuotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterQuotes = () => {
    let filtered = [...quotes]

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    // Filtro por origem (chat ou manual)
    if (sourceFilter !== 'all') {
      if (sourceFilter === 'chat') {
        filtered = filtered.filter(quote => quote.created_from_chat === true)
      } else if (sourceFilter === 'manual') {
        filtered = filtered.filter(quote => quote.created_from_chat !== true)
      }
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(quote => 
            new Date(quote.created_at) >= filterDate
          )
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(quote => 
            new Date(quote.created_at) >= filterDate
          )
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(quote => 
            new Date(quote.created_at) >= filterDate
          )
          break
      }
    }

    setFilteredQuotes(filtered)
  }

  // Função para visualizar conversa do chat
  const viewConversation = async (quote) => {
    if (!quote.chat_conversation_id) return

    try {
      setShowConversationModal(true)
      setSelectedConversation(quote.chat_conversation_id)
      setConversationMessages([])

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', quote.chat_conversation_id)
        .order('created_at', { ascending: true })

      if (error) throw error

      setConversationMessages(messages || [])
    } catch (error) {
      console.error('Erro ao carregar conversa:', error)
      alert('Erro ao carregar conversa do chat')
    }
  }

  const generateQuoteNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ORC-${year}${month}${day}-${random}`
  }

  const calculateItemTotal = (quantity, unitPrice) => {
    return quantity * unitPrice
  }

  const calculateQuoteTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = (subtotal * formData.discount) / 100
    return subtotal - discountAmount
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = calculateItemTotal(
        newItems[index].quantity, 
        newItems[index].unit_price
      )
    }
    
    const total = newItems.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = (total * formData.discount) / 100
    
    setFormData({
      ...formData, 
      items: newItems,
      total_amount: total - discountAmount
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_name: '', quantity: 1, unit_price: 0, total: 0 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      const total = newItems.reduce((sum, item) => sum + item.total, 0)
      const discountAmount = (total * formData.discount) / 100
      setFormData({ 
        ...formData, 
        items: newItems,
        total_amount: total - discountAmount
      })
    }
  }

  const openModal = (quote = null) => {
    if (quote) {
      setSelectedQuote(quote)
      
      // Processar itens do orçamento
      let items = [{ product_name: '', quantity: 1, unit_price: 0, total: 0 }]
      if (quote.quote_items && quote.quote_items.length > 0) {
        items = quote.quote_items.map(item => ({
          product_name: item.product_name || '',
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          total: item.total_price || (item.quantity * item.unit_price) || 0
        }))
      } else if (quote.items && quote.items.length > 0) {
        items = quote.items
      }

      setFormData({
        customer_name: quote.customer_name || '',
        customer_email: quote.customer_email || '',
        customer_phone: quote.customer_phone || '',
        customer_company: quote.customer_company || '',
        quote_number: quote.quote_number || '',
        items: items,
        total_amount: quote.total_amount || quote.value || 0,
        discount: quote.discount || 0,
        notes: quote.notes || '',
        valid_until: quote.valid_until ? quote.valid_until.split('T')[0] : ''
      })
      setIsEditing(true)
    } else {
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_company: '',
        quote_number: generateQuoteNumber(),
        items: [{ product_name: '', quantity: 1, unit_price: 0, total: 0 }],
        total_amount: 0,
        discount: 0,
        notes: '',
        valid_until: ''
      })
      setIsEditing(false)
      setSelectedQuote(null)
    }
    setShowModal(true)
  }

  const openViewModal = (quote) => {
    setViewingQuote(quote)
    setShowViewModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedQuote(null)
    setIsEditing(false)
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setViewingQuote(null)
  }

  const closeConversationModal = () => {
    setShowConversationModal(false)
    setSelectedConversation(null)
    setConversationMessages([])
  }

  const saveQuote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (!formData.customer_name.trim()) {
        alert('Nome do cliente é obrigatório')
        return
      }

      const quoteData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_company: formData.customer_company,
        quote_number: formData.quote_number,
        total_amount: calculateQuoteTotal(),
        value: calculateQuoteTotal(), // Para compatibilidade
        discount: formData.discount,
        notes: formData.notes,
        valid_until: formData.valid_until || null,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }

      let quoteId

      if (isEditing && selectedQuote) {
        const { error } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', selectedQuote.id)

        if (error) throw error
        quoteId = selectedQuote.id

        // Deletar itens existentes
        await supabase
          .from('quote_items')
          .delete()
          .eq('quote_id', selectedQuote.id)

      } else {
        const { data, error } = await supabase
          .from('quotes')
          .insert([{ 
            ...quoteData, 
            status: 'draft',
            created_from_chat: false
          }])
          .select()

        if (error) throw error
        quoteId = data[0].id
      }

      // Inserir itens
      const itemsToInsert = formData.items
        .filter(item => item.product_name.trim())
        .map(item => ({
          quote_id: quoteId,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total
        }))

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }

      fetchQuotes()
      closeModal()
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      alert('Erro ao salvar orçamento')
    }
  }

  const deleteQuote = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este orçamento?')) return

    try {
      // Deletar itens primeiro
      await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', id)

      // Deletar orçamento
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchQuotes()
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      fetchQuotes()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const duplicateQuote = async (quote) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newQuoteData = {
        customer_name: quote.customer_name,
        customer_email: quote.customer_email,
        customer_phone: quote.customer_phone,
        customer_company: quote.customer_company,
        quote_number: generateQuoteNumber(),
        total_amount: quote.total_amount,
        value: quote.value,
        discount: quote.discount || 0,
        notes: quote.notes,
        valid_until: null,
        status: 'draft',
        created_from_chat: false,
        user_id: user.id
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert([newQuoteData])
        .select()

      if (error) throw error

      // Duplicar itens se existirem
      if (quote.quote_items && quote.quote_items.length > 0) {
        const itemsToInsert = quote.quote_items.map(item => ({
          quote_id: data[0].id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }))

        await supabase
          .from('quote_items')
          .insert(itemsToInsert)
      }

      fetchQuotes()
    } catch (error) {
      console.error('Erro ao duplicar orçamento:', error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatsData = () => {
    const total = filteredQuotes.length
    const approved = filteredQuotes.filter(q => q.status === 'approved').length
    const pending = filteredQuotes.filter(q => q.status === 'sent').length
    const fromChat = filteredQuotes.filter(q => q.created_from_chat === true).length
    const totalValue = filteredQuotes
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + (q.total_amount || q.value || 0), 0)

    return { total, approved, pending, fromChat, totalValue }
  }

  const stats = getStatsData()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-600 bg-opacity-20">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500/30 transition-colors">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-20">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Aprovados</p>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500/30 transition-colors">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-600 bg-opacity-20">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500/30 transition-colors">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-600 bg-opacity-20">
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Via Chat IA</p>
              <p className="text-2xl font-bold text-white">{stats.fromChat}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500/30 transition-colors">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-600 bg-opacity-20">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Valor Vendido</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orçamentos</h2>
          <p className="text-gray-400">Gerencie seus orçamentos e propostas comerciais</p>
        </div>
        
        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por cliente, número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunho</option>
            <option value="sent">Enviado</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
            <option value="expired">Expirado</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Todas as Origens</option>
            <option value="manual">Manual</option>
            <option value="chat">Via Chat IA</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Todas as Datas</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            {filteredQuotes.length} orçamentos
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => {
                  const StatusIcon = statusOptions[quote.status]?.icon || Clock
                  return (
                    <tr key={quote.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{quote.customer_name}</div>
                          {quote.customer_company && (
                            <div className="text-sm text-gray-400">{quote.customer_company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {quote.quote_number}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {formatCurrency(quote.total_amount || quote.value)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusOptions[quote.status]?.color || 'bg-gray-500/20 text-gray-300 border-gray-500/20'}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusOptions[quote.status]?.label || quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {quote.created_from_chat ? (
                            <>
                              <Bot className="w-4 h-4 mr-2 text-purple-400" />
                              <span className="text-purple-300 text-sm">Chat IA</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 mr-2 text-blue-400" />
                              <span className="text-blue-300 text-sm">Manual</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(quote.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openViewModal(quote)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {quote.created_from_chat && quote.chat_conversation_id && (
                            <button
                              onClick={() => viewConversation(quote)}
                              className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded-lg transition-colors"
                              title="Ver Conversa do Chat"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => openModal(quote)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => duplicateQuote(quote)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Duplicar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          
                          <div className="relative group">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                              <DollarSign className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1 min-w-32">
                                <button
                                  onClick={() => updateStatus(quote.id, 'sent')}
                                  className="w-full px-4 py-2 text-left text-blue-300 hover:bg-gray-600 transition-colors"
                                >
                                  <Send className="w-3 h-3 inline mr-2" />
                                  Enviar
                                </button>
                                <button
                                  onClick={() => updateStatus(quote.id, 'approved')}
                                  className="w-full px-4 py-2 text-left text-green-300 hover:bg-gray-600 transition-colors"
                                >
                                  <CheckCircle className="w-3 h-3 inline mr-2" />
                                  Aprovar
                                </button>
                                <button
                                  onClick={() => updateStatus(quote.id, 'rejected')}
                                  className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-600 transition-colors"
                                >
                                  <XCircle className="w-3 h-3 inline mr-2" />
                                  Rejeitar
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteQuote(quote.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Nenhum orçamento encontrado</p>
                    <button
                      onClick={() => openModal()}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Orçamento
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.customer_company}
                    onChange={(e) => setFormData({...formData, customer_company: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número do Orçamento
                  </label>
                  <input
                    type="text"
                    value={formData.quote_number}
                    onChange={(e) => setFormData({...formData, quote_number: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Válido até
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0
                      const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
                      const discountAmount = (subtotal * discount) / 100
                      setFormData({
                        ...formData, 
                        discount,
                        total_amount: subtotal - discountAmount
                      })
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    Itens do Orçamento
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar Item
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-700 rounded-lg">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="Nome do produto/serviço"
                          value={item.product_name}
                          onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          placeholder="Qtd"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          placeholder="Valor Unit."
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Total"
                          value={formatCurrency(item.total)}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-300 text-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-1">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gray-700 rounded-lg p-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(formData.items.reduce((sum, item) => sum + item.total, 0))}</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-400">
                        <span>Desconto ({formData.discount}%):</span>
                        <span>- {formatCurrency((formData.items.reduce((sum, item) => sum + item.total, 0) * formData.discount) / 100)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-bold text-white border-t border-gray-600 pt-2">
                      <span>Total do Orçamento:</span>
                      <span className="text-orange-400">{formatCurrency(calculateQuoteTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  rows="4"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Informações adicionais, termos e condições..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveQuote}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-200"
              >
                {isEditing ? 'Atualizar' : 'Salvar'} Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && viewingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white">Orçamento #{viewingQuote.quote_number}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Criado em {formatDate(viewingQuote.created_at)}
                  {viewingQuote.created_from_chat && <span className="ml-2 text-purple-400">• Via Chat IA</span>}
                </p>
              </div>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusOptions[viewingQuote.status]?.color || 'bg-gray-500/20 text-gray-300 border-gray-500/20'}`}>
                    {React.createElement(statusOptions[viewingQuote.status]?.icon || Clock, { className: "w-4 h-4 mr-2" })}
                    {statusOptions[viewingQuote.status]?.label || viewingQuote.status}
                  </span>
                  {viewingQuote.valid_until && (
                    <span className="text-sm text-gray-400">
                      Válido até: {formatDate(viewingQuote.valid_until)}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(viewingQuote.total_amount || viewingQuote.value)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Dados do Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Nome</p>
                    <p className="text-white font-medium">{viewingQuote.customer_name}</p>
                  </div>
                  {viewingQuote.customer_email && (
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{viewingQuote.customer_email}</p>
                    </div>
                  )}
                  {viewingQuote.customer_phone && (
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white">{viewingQuote.customer_phone}</p>
                    </div>
                  )}
                  {viewingQuote.customer_company && (
                    <div>
                      <p className="text-sm text-gray-400">Empresa</p>
                      <p className="text-white">{viewingQuote.customer_company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              {(viewingQuote.quote_items?.length > 0 || viewingQuote.items?.length > 0) && (
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Itens do Orçamento</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-2 text-gray-400">Produto/Serviço</th>
                          <th className="text-center py-2 text-gray-400">Qtd</th>
                          <th className="text-right py-2 text-gray-400">Valor Unit.</th>
                          <th className="text-right py-2 text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(viewingQuote.quote_items || viewingQuote.items || []).map((item, index) => (
                          <tr key={index} className="border-b border-gray-600">
                            <td className="py-2 text-white">{item.product_name}</td>
                            <td className="py-2 text-center text-gray-300">{item.quantity}</td>
                            <td className="py-2 text-right text-gray-300">{formatCurrency(item.unit_price)}</td>
                            <td className="py-2 text-right text-white font-medium">
                              {formatCurrency(item.total_price || item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex justify-end space-y-1">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          Total: <span className="text-orange-400">{formatCurrency(viewingQuote.total_amount || viewingQuote.value)}</span>
                        </div>
                        {viewingQuote.discount > 0 && (
                          <div className="text-sm text-gray-400">
                            (Desconto de {viewingQuote.discount}% aplicado)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingQuote.notes && (
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Observações</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">{viewingQuote.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700">
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(viewingQuote)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => duplicateQuote(viewingQuote)}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </button>
              </div>
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conversa do Chat */}
      {showConversationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                Conversa do Chat IA
              </h3>
              <button
                onClick={closeConversationModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '60vh' }}>
              {conversationMessages.length > 0 ? (
                conversationMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">
                          {message.role === 'user' ? 'Você' : 'Chat IA'}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Carregando conversa...</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700">
              <button
                onClick={closeConversationModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}