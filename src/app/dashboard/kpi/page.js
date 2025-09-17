'use client'

import { useState, useEffect } from 'react'
import { supabase, auth } from '@/lib/supabase'
import { 
  DollarSign, 
  FileText, 
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  XCircle
} from 'lucide-react'

export default function KPIPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [error, setError] = useState(null)
  const [kpiData, setKpiData] = useState({
    financial: {
      totalQuoteValue: 0,
      approvedValue: 0,
      pendingValue: 0,
      rejectedValue: 0,
      averageQuoteValue: 0
    },
    quotes: {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
      conversionRate: 0
    },
    products: {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
      averagePrice: 0
    },
    customers: {
      uniqueCustomers: 0,
      quotesPerCustomer: 0,
      topCustomers: []
    },
    trends: {
      quotesGrowth: 0,
      revenueGrowth: 0,
      customersGrowth: 0
    }
  })

  useEffect(() => {
    loadUserAndData()
  }, [selectedPeriod])

  const loadUserAndData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentUser = await auth.getUser()
      if (!currentUser) {
        window.location.href = '/login'
        return
      }

      setUser(currentUser)
      await loadRealKPIData(currentUser.id)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar os dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const loadRealKPIData = async (userId) => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod))

      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - parseInt(selectedPeriod))

      console.log('Período atual:', startDate.toISOString(), 'até', endDate.toISOString())
      console.log('Período anterior:', previousStartDate.toISOString(), 'até', startDate.toISOString())

      // Buscar dados reais das tabelas com tratamento de erro individual
      const [currentQuotesResult, previousQuotesResult, allProductsResult] = await Promise.allSettled([
        supabase
          .from('quotes')
          .select(`
            *,
            quote_items (
              quantity,
              unit_price,
              total_price,
              product_id
            )
          `)
          .eq('user_id', userId)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false }),

        supabase
          .from('quotes')
          .select(`
            *,
            quote_items (
              quantity,
              unit_price,
              total_price
            )
          `)
          .eq('user_id', userId)
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),

        supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
      ])

      // Processar resultados com fallback para erro
      const quotes = currentQuotesResult.status === 'fulfilled' ? (currentQuotesResult.value.data || []) : []
      const previousQuotesData = previousQuotesResult.status === 'fulfilled' ? (previousQuotesResult.value.data || []) : []
      const products = allProductsResult.status === 'fulfilled' ? (allProductsResult.value.data || []) : []

      console.log('Dados carregados:', {
        quotesAtuais: quotes.length,
        quotesAnteriores: previousQuotesData.length,
        produtos: products.length
      })

      // Calcular KPIs financeiros com mais precisão
      let totalQuoteValue = 0
      let approvedValue = 0
      let pendingValue = 0
      let rejectedValue = 0

      quotes.forEach(quote => {
        let quoteValue = 0
        
        // Priorizar valor calculado dos itens se existir
        if (quote.quote_items && quote.quote_items.length > 0) {
          quoteValue = quote.quote_items.reduce((sum, item) => {
            return sum + (parseFloat(item.total_price) || (parseFloat(item.quantity) * parseFloat(item.unit_price)) || 0)
          }, 0)
        } else {
          // Fallback para o valor total do orçamento
          quoteValue = parseFloat(quote.total_value) || parseFloat(quote.value) || 0
        }

        totalQuoteValue += quoteValue

        switch (quote.status) {
          case 'approved':
          case 'aprovado':
            approvedValue += quoteValue
            break
          case 'sent':
          case 'enviado':
          case 'pending':
          case 'pendente':
            pendingValue += quoteValue
            break
          case 'rejected':
          case 'rejeitado':
            rejectedValue += quoteValue
            break
        }
      })
      
      const averageQuoteValue = quotes.length > 0 ? totalQuoteValue / quotes.length : 0

      // Calcular status dos orçamentos com mais variações de status
      const approved = quotes.filter(q => ['approved', 'aprovado'].includes(q.status?.toLowerCase())).length
      const pending = quotes.filter(q => ['sent', 'enviado', 'pending', 'pendente'].includes(q.status?.toLowerCase())).length
      const rejected = quotes.filter(q => ['rejected', 'rejeitado'].includes(q.status?.toLowerCase())).length
      const draft = quotes.filter(q => ['draft', 'rascunho'].includes(q.status?.toLowerCase())).length
      
      const conversionRate = quotes.length > 0 ? (approved / quotes.length) * 100 : 0

      // Calcular métricas de produtos com mais detalhes
      const lowStockProducts = products.filter(p => {
        const stock = parseInt(p.stock_quantity) || parseInt(p.quantity) || 0
        const minStock = parseInt(p.min_stock) || 5
        return stock > 0 && stock <= minStock
      }).length
      
      const outOfStockProducts = products.filter(p => {
        const stock = parseInt(p.stock_quantity) || parseInt(p.quantity) || 0
        return stock <= 0
      }).length

      const totalProductValue = products.reduce((sum, product) => {
        const stock = parseInt(product.stock_quantity) || parseInt(product.quantity) || 0
        const price = parseFloat(product.price) || parseFloat(product.unit_price) || 0
        return sum + (stock * price)
      }, 0)

      const averageProductPrice = products.length > 0 
        ? products.reduce((sum, p) => sum + (parseFloat(p.price) || parseFloat(p.unit_price) || 0), 0) / products.length 
        : 0

      // Calcular métricas de clientes com mais detalhes
      const customerEmails = quotes
        .filter(q => q.customer_email)
        .map(q => q.customer_email.toLowerCase().trim())
        .filter(email => email.length > 0)

      const uniqueCustomers = new Set(customerEmails).size
      const quotesPerCustomer = uniqueCustomers > 0 ? quotes.length / uniqueCustomers : 0

      // Top clientes (por número de orçamentos)
      const customerCounts = {}
      customerEmails.forEach(email => {
        customerCounts[email] = (customerCounts[email] || 0) + 1
      })

      const topCustomers = Object.entries(customerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([email, count]) => ({ email, quotes: count }))

      // Calcular tendências (comparação com período anterior)
      const previousQuotesCount = previousQuotesData.length
      const quotesGrowth = previousQuotesCount > 0 
        ? ((quotes.length - previousQuotesCount) / previousQuotesCount) * 100 
        : quotes.length > 0 ? 100 : 0

      // Calcular receita anterior com a mesma lógica
      let previousRevenue = 0
      previousQuotesData.forEach(quote => {
        if (['approved', 'aprovado'].includes(quote.status?.toLowerCase())) {
          let quoteValue = 0
          if (quote.quote_items && quote.quote_items.length > 0) {
            quoteValue = quote.quote_items.reduce((sum, item) => {
              return sum + (parseFloat(item.total_price) || (parseFloat(item.quantity) * parseFloat(item.unit_price)) || 0)
            }, 0)
          } else {
            quoteValue = parseFloat(quote.total_value) || parseFloat(quote.value) || 0
          }
          previousRevenue += quoteValue
        }
      })
      
      const revenueGrowth = previousRevenue > 0 
        ? ((approvedValue - previousRevenue) / previousRevenue) * 100 
        : approvedValue > 0 ? 100 : 0

      // Calcular crescimento de clientes
      const previousCustomers = new Set(
        previousQuotesData
          .filter(q => q.customer_email)
          .map(q => q.customer_email.toLowerCase().trim())
      ).size

      const customersGrowth = previousCustomers > 0 
        ? ((uniqueCustomers - previousCustomers) / previousCustomers) * 100 
        : uniqueCustomers > 0 ? 100 : 0

      setKpiData({
        financial: {
          totalQuoteValue,
          approvedValue,
          pendingValue,
          rejectedValue,
          averageQuoteValue
        },
        quotes: {
          total: quotes.length,
          approved,
          pending,
          rejected,
          draft,
          conversionRate
        },
        products: {
          total: products.length,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
          totalValue: totalProductValue,
          averagePrice: averageProductPrice
        },
        customers: {
          uniqueCustomers,
          quotesPerCustomer,
          topCustomers
        },
        trends: {
          quotesGrowth,
          revenueGrowth,
          customersGrowth
        }
      })

    } catch (error) {
      console.error('Erro ao carregar KPIs:', error)
      setError('Erro ao processar os dados dos KPIs')
    }
  }

  const refreshData = async () => {
    if (!user) return
    setRefreshing(true)
    await loadRealKPIData(user.id)
    setRefreshing(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatPercent = (value) => {
    if (!isFinite(value)) return '0.0%'
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0)
  }

  const getTrendIcon = (value) => {
    if (!isFinite(value)) return <div className="w-4 h-4" />
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  const getTrendColor = (value) => {
    if (!isFinite(value)) return 'text-gray-400'
    return value >= 0 ? 'text-green-500' : 'text-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Carregando KPIs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadUserAndData}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center mb-2">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 mr-4 text-orange-500" />
              Indicadores de Performance
            </h1>
            <p className="text-gray-400 text-lg">
              Métricas operacionais em tempo real • {formatNumber(kpiData.quotes.total)} orçamentos analisados
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* KPIs Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Receita Aprovada */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              {getTrendIcon(kpiData.trends.revenueGrowth)}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Receita Aprovada</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(kpiData.financial.approvedValue)}
            </p>
            <p className={`text-sm ${getTrendColor(kpiData.trends.revenueGrowth)}`}>
              {formatPercent(kpiData.trends.revenueGrowth)} vs período anterior
            </p>
          </div>

          {/* Total de Orçamentos */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              {getTrendIcon(kpiData.trends.quotesGrowth)}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Orçamentos</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatNumber(kpiData.quotes.total)}
            </p>
            <p className={`text-sm ${getTrendColor(kpiData.trends.quotesGrowth)}`}>
              {formatPercent(kpiData.trends.quotesGrowth)} vs período anterior
            </p>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                kpiData.quotes.conversionRate >= 30 ? 'bg-green-600/20 text-green-400' :
                kpiData.quotes.conversionRate >= 15 ? 'bg-yellow-600/20 text-yellow-400' :
                'bg-red-600/20 text-red-400'
              }`}>
                {kpiData.quotes.conversionRate >= 30 ? 'Excelente' :
                 kpiData.quotes.conversionRate >= 15 ? 'Boa' : 'Precisa melhorar'}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Taxa de Conversão</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {kpiData.quotes.conversionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">
              {formatNumber(kpiData.quotes.approved)} de {formatNumber(kpiData.quotes.total)} aprovados
            </p>
          </div>

          {/* Ticket Médio */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Ticket Médio</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(kpiData.financial.averageQuoteValue)}
            </p>
            <p className="text-sm text-gray-400">
              Por orçamento criado
            </p>
          </div>
        </div>

        {/* Segunda Linha de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Clientes Únicos */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
              {getTrendIcon(kpiData.trends.customersGrowth)}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Clientes Únicos</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatNumber(kpiData.customers.uniqueCustomers)}
            </p>
            <p className={`text-sm ${getTrendColor(kpiData.trends.customersGrowth)}`}>
              {formatPercent(kpiData.trends.customersGrowth)} vs período anterior
            </p>
          </div>

          {/* Valor Total em Estoque */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Valor em Estoque</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(kpiData.products.totalValue)}
            </p>
            <p className="text-sm text-gray-400">
              {formatNumber(kpiData.products.total)} produtos
            </p>
          </div>

          {/* Pipeline de Vendas */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Pipeline Pendente</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(kpiData.financial.pendingValue)}
            </p>
            <p className="text-sm text-gray-400">
              {formatNumber(kpiData.quotes.pending)} orçamentos aguardando
            </p>
          </div>
        </div>

        {/* Detalhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Status dos Orçamentos */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Status dos Orçamentos
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-600/10 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-gray-300">Aprovados</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold block">{formatNumber(kpiData.quotes.approved)}</span>
                  <span className="text-green-400 text-sm">{formatCurrency(kpiData.financial.approvedValue)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-600/10 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-gray-300">Pendentes</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold block">{formatNumber(kpiData.quotes.pending)}</span>
                  <span className="text-yellow-400 text-sm">{formatCurrency(kpiData.financial.pendingValue)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-600/10 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-300">Rascunhos</span>
                </div>
                <span className="text-white font-semibold">{formatNumber(kpiData.quotes.draft)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-gray-300">Rejeitados</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold block">{formatNumber(kpiData.quotes.rejected)}</span>
                  <span className="text-red-400 text-sm">{formatCurrency(kpiData.financial.rejectedValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Situação do Estoque */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-500" />
              Situação do Estoque
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-600/10 rounded-lg">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-gray-300">Total de Produtos</span>
                </div>
                <span className="text-white font-semibold">{formatNumber(kpiData.products.total)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-600/10 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="text-gray-300">Estoque Baixo</span>
                </div>
                <span className="text-white font-semibold">{formatNumber(kpiData.products.lowStock)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-600/10 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-gray-300">Sem Estoque</span>
                </div>
                <span className="text-white font-semibold">{formatNumber(kpiData.products.outOfStock)}</span>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Valor Médio por Produto:</span>
                  <span className="text-blue-400 font-semibold">
                    {formatCurrency(kpiData.products.averagePrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Valor Total em Estoque:</span>
                  <span className="text-green-500 font-semibold">
                    {formatCurrency(kpiData.products.totalValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro Detalhado */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Resumo Financeiro Completo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-600/10 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total em Orçamentos</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(kpiData.financial.totalQuoteValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-600/10 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Receita Confirmada</p>
              <p className="text-xl font-bold text-green-400">
                {formatCurrency(kpiData.financial.approvedValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-yellow-600/10 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Aguardando Aprovação</p>
              <p className="text-xl font-bold text-yellow-400">
                {formatCurrency(kpiData.financial.pendingValue)}
              </p>
            </div>

            <div className="text-center p-4 bg-red-600/10 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Valor Rejeitado</p>
              <p className="text-xl font-bold text-red-400">
                {formatCurrency(kpiData.financial.rejectedValue)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Sucesso Financeiro:</span>
                <span className="text-white font-semibold">
                  {kpiData.financial.totalQuoteValue > 0 
                    ? ((kpiData.financial.approvedValue / kpiData.financial.totalQuoteValue) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orçamentos por Cliente:</span>
                <span className="text-white font-semibold">
                  {kpiData.customers.quotesPerCustomer.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clientes */}
        {kpiData.customers.topCustomers.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Top 5 Clientes (por número de orçamentos)
            </h3>
            
            <div className="space-y-3">
              {kpiData.customers.topCustomers.map((customer, index) => (
                <div key={customer.email} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{customer.email}</span>
                  </div>
                  <span className="text-gray-400">
                    {formatNumber(customer.quotes)} orçamento{customer.quotes > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertas Inteligentes */}
        <div className="space-y-4">
          {/* Alertas de Estoque */}
          {(kpiData.products.outOfStock > 0 || kpiData.products.lowStock > 0) && (
            <div className="bg-gradient-to-r from-yellow-900/20 to-red-900/20 border border-yellow-600/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Alertas de Estoque Críticos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kpiData.products.outOfStock > 0 && (
                  <div className="flex items-center p-3 bg-red-600/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 mr-3 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-300 font-semibold">
                        {formatNumber(kpiData.products.outOfStock)} produto{kpiData.products.outOfStock > 1 ? 's' : ''} sem estoque
                      </p>
                      <p className="text-red-400/70 text-sm">Vendas podem ser perdidas</p>
                    </div>
                  </div>
                )}
                {kpiData.products.lowStock > 0 && (
                  <div className="flex items-center p-3 bg-yellow-600/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-300 font-semibold">
                        {formatNumber(kpiData.products.lowStock)} produto{kpiData.products.lowStock > 1 ? 's' : ''} com estoque baixo
                      </p>
                      <p className="text-yellow-400/70 text-sm">Reposição recomendada</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alert de Performance */}
          {kpiData.quotes.total > 10 && kpiData.quotes.conversionRate < 15 && (
            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-600/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-500" />
                Alerta de Performance
              </h3>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-orange-300 font-semibold">
                    Taxa de conversão abaixo do recomendado ({kpiData.quotes.conversionRate.toFixed(1)}%)
                  </p>
                  <p className="text-orange-400/70 text-sm">
                    Considere revisar a estratégia de follow-up com clientes ou ajustar preços
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alert de Sucesso */}
          {kpiData.quotes.conversionRate >= 30 && kpiData.trends.revenueGrowth > 20 && (
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Excelente Performance!
              </h3>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-300 font-semibold">
                    Ótima taxa de conversão ({kpiData.quotes.conversionRate.toFixed(1)}%) e crescimento de receita ({formatPercent(kpiData.trends.revenueGrowth)})
                  </p>
                  <p className="text-green-400/70 text-sm">
                    Continue com a estratégia atual e considere expandir operações
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com informações técnicas */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Dados atualizados em tempo real • Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}