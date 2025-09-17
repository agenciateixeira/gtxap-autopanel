// src/app/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Package, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  BarChart3,
  MessageSquare,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import ChatIA from '@/components/dashboard/ChatIA'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalQuotes: 0,
    approvedQuotes: 0,
    totalSales: 0,
    quotesThisMonth: 0
  })
  
  const [recentQuotes, setRecentQuotes] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Fix hydration - só renderiza após montar no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchDashboardData()
    }
  }, [mounted])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Buscar estatísticas do dashboard
      const { data: dashboardStats } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (dashboardStats) {
        setStats({
          totalProducts: dashboardStats.total_products || 0,
          lowStockProducts: dashboardStats.low_stock_products || 0,
          totalQuotes: dashboardStats.total_quotes || 0,
          approvedQuotes: dashboardStats.approved_quotes || 0,
          totalSales: dashboardStats.total_sales || 0,
          quotesThisMonth: dashboardStats.quotes_this_month || 0
        })
      }

      // Buscar orçamentos recentes
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentQuotes(quotes || [])

      // Buscar produtos com estoque baixo
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .filter('stock_quantity', 'lte', 'min_stock')
        .limit(5)

      setLowStockItems(products || [])

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Funções de formatação com fallback
  const formatCurrency = (value) => {
    if (!mounted) return 'R$ 0,00' // Fallback para server-side
    
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0)
    } catch (error) {
      return `R$ ${(value || 0).toFixed(2).replace('.', ',')}`
    }
  }

  const formatDate = (date) => {
    if (!mounted) return '--/--/----' // Fallback para server-side
    
    try {
      return new Date(date).toLocaleDateString('pt-BR')
    } catch (error) {
      return new Date(date).toISOString().split('T')[0].split('-').reverse().join('/')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Evita renderização durante hidratação
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
    <div className="space-y-6" suppressHydrationWarning>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-600 bg-opacity-20">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Produtos</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Estoque Baixo</p>
              <p className="text-2xl font-bold text-white">{stats.lowStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-600 bg-opacity-20">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Orçamentos</p>
              <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-20">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Vendas Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSales)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat IA - Seção Principal */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
            Consulta Inteligente de Estoque
          </h3>
        </div>
        
        <ChatIA />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orçamentos Recentes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Orçamentos Recentes</h3>
            <Link 
              href="/dashboard/orcamentos"
              className="text-orange-500 hover:text-orange-400 text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{quote.client_name}</p>
                    <p className="text-sm text-gray-400">#{quote.quote_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(quote.total_amount)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum orçamento encontrado</p>
                <Link 
                  href="/dashboard/orcamentos"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Orçamento
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Estoque Baixo */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Estoque Baixo</h3>
            <Link 
              href="/dashboard/estoque"
              className="text-orange-500 hover:text-orange-400 text-sm font-medium"
            >
              Ver estoque
            </Link>
          </div>
          
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-400">{item.stock_quantity} {item.unit}</p>
                    <p className="text-xs text-gray-400">Mín: {item.min_stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Estoque em níveis adequados</p>
                <Link 
                  href="/dashboard/estoque"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Ações Rápidas</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/estoque"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
          >
            <Package className="w-8 h-8 text-orange-500 group-hover:text-orange-400 mr-3" />
            <div>
              <p className="text-white font-medium">Gerenciar Estoque</p>
              <p className="text-sm text-gray-400">Adicionar/editar produtos</p>
            </div>
          </Link>

          <Link
            href="/dashboard/orcamentos"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
          >
            <FileText className="w-8 h-8 text-blue-500 group-hover:text-blue-400 mr-3" />
            <div>
              <p className="text-white font-medium">Novo Orçamento</p>
              <p className="text-sm text-gray-400">Criar proposta comercial</p>
            </div>
          </Link>

          <Link
            href="/dashboard/erp"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
          >
            <BarChart3 className="w-8 h-8 text-green-500 group-hover:text-green-400 mr-3" />
            <div>
              <p className="text-white font-medium">Sincronizar ERP</p>
              <p className="text-sm text-gray-400">Atualizar dados</p>
            </div>
          </Link>

          <Link
            href="/dashboard/kpi"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
          >
            <TrendingUp className="w-8 h-8 text-purple-500 group-hover:text-purple-400 mr-3" />
            <div>
              <p className="text-white font-medium">Ver Relatórios</p>
              <p className="text-sm text-gray-400">Análises e métricas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}