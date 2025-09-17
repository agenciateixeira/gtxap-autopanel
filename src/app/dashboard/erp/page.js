// src/app/dashboard/erp/page.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { 
  Database, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertCircle,
  Plus,
  Download,
  Upload,
  Activity,
  Clock,
  Users,
  Building2,
  Lock,
  Unlock,
  Eye,
  Trash2,
  Edit3,
  Play,
  Pause,
  RotateCcw,
  X
} from 'lucide-react'

export default function ERPPage() {
  const [connections, setConnections] = useState([])
  const [syncLogs, setSyncLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  
  const [newConnection, setNewConnection] = useState({
    erp_name: '',
    erp_type: '',
    api_endpoint: '',
    api_key: '',
    username: '',
    password: '',
    sync_frequency: 'daily'
  })

  // ERPs suportados no Brasil
  const supportedERPs = [
    {
      name: 'TOTVS Protheus',
      type: 'totvs_protheus',
      description: 'Sistema ERP líder no Brasil para grandes empresas',
      supported_endpoints: ['/api/products', '/api/orders', '/api/customers'],
      authentication_type: 'api_key',
      icon: '🏢'
    },
    {
      name: 'SAP Business One',
      type: 'sap_b1',
      description: 'Solução ERP para pequenas e médias empresas',
      supported_endpoints: ['/api/items', '/api/orders', '/api/partners'],
      authentication_type: 'basic_auth',
      icon: '💼'
    },
    {
      name: 'Senior Sistemas',
      type: 'senior',
      description: 'ERP brasileiro com foco em gestão empresarial',
      supported_endpoints: ['/api/produtos', '/api/pedidos', '/api/clientes'],
      authentication_type: 'oauth',
      icon: '🔧'
    },
    {
      name: 'Sankhya',
      type: 'sankhya',
      description: 'Plataforma de gestão empresarial na nuvem',
      supported_endpoints: ['/api/product', '/api/order', '/api/customer'],
      authentication_type: 'api_key',
      icon: '☁️'
    },
    {
      name: 'Microsiga',
      type: 'microsiga',
      description: 'Sistema integrado de gestão empresarial',
      supported_endpoints: ['/api/estoque', '/api/vendas', '/api/cadastros'],
      authentication_type: 'basic_auth',
      icon: '🖥️'
    },
    {
      name: 'Bling',
      type: 'bling',
      description: 'ERP online para pequenas e médias empresas',
      supported_endpoints: ['/api/produtos', '/api/pedidos', '/api/contatos'],
      authentication_type: 'api_key',
      icon: '🚀'
    },
    {
      name: 'Tiny ERP',
      type: 'tiny',
      description: 'Sistema de gestão empresarial online',
      supported_endpoints: ['/api/produtos.pesquisa', '/api/pedidos.pesquisa'],
      authentication_type: 'api_key',
      icon: '📦'
    },
    {
      name: 'Omie',
      type: 'omie',
      description: 'ERP completo para gestão empresarial',
      supported_endpoints: ['/api/produtos', '/api/vendas', '/api/clientes'],
      authentication_type: 'api_key',
      icon: '⚡'
    }
  ]

  useEffect(() => {
    fetchERPConnections()
    fetchSyncLogs()
  }, [])

  const fetchERPConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('erp_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setConnections(data || [])

    } catch (error) {
      console.error('Erro ao buscar conexões ERP:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSyncLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('sync_logs')
        .select(`
          *,
          erp_connections!inner(erp_name)
        `)
        .eq('erp_connections.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setSyncLogs(data || [])

    } catch (error) {
      console.error('Erro ao buscar logs de sincronização:', error)
    }
  }

  const handleAddConnection = async (e) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setSyncing(true)

      // Primeiro, testar a conexão
      const testResult = await testERPConnection(newConnection)
      
      if (!testResult.success) {
        toast.error(`Erro ao conectar: ${testResult.message}`)
        return
      }

      // Salvar conexão no banco
      const { error } = await supabase
        .from('erp_connections')
        .insert({
          user_id: user.id,
          erp_name: newConnection.erp_name,
          erp_type: newConnection.erp_type,
          api_endpoint: newConnection.api_endpoint,
          api_key: newConnection.api_key,
          username: newConnection.username,
          password: newConnection.password,
          sync_frequency: newConnection.sync_frequency,
          status: 'connected',
          is_active: true,
          last_sync: new Date().toISOString()
        })

      if (error) throw error

      setShowAddModal(false)
      setNewConnection({
        erp_name: '',
        erp_type: '',
        api_endpoint: '',
        api_key: '',
        username: '',
        password: '',
        sync_frequency: 'daily'
      })
      
      await fetchERPConnections()
      toast.success('Conexão ERP configurada com sucesso!')

    } catch (error) {
      console.error('Erro ao adicionar conexão ERP:', error)
      toast.error('Erro ao configurar conexão ERP')
    } finally {
      setSyncing(false)
    }
  }

  const testERPConnection = async (connectionData) => {
    try {
      const response = await fetch('/api/erp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionData)
      })

      if (!response.ok) {
        return { success: false, message: 'Falha na conexão com o ERP' }
      }

      const result = await response.json()
      return result

    } catch (error) {
      return { success: false, message: 'Erro de rede ao testar conexão' }
    }
  }

  const handleSyncNow = async (connectionId) => {
    try {
      setSyncing(true)
      
      const response = await fetch('/api/erp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, syncType: 'products' })
      })

      if (!response.ok) throw new Error('Falha na sincronização')

      const result = await response.json()
      
      // Atualizar logs
      await fetchSyncLogs()
      await fetchERPConnections()
      
      toast.success(`Sincronização concluída: ${result.syncedItems} itens processados`)

    } catch (error) {
      console.error('Erro na sincronização:', error)
      toast.error('Erro durante a sincronização')
    } finally {
      setSyncing(false)
    }
  }

  const toggleConnection = async (connectionId, isActive) => {
    try {
      const { error } = await supabase
        .from('erp_connections')
        .update({ is_active: !isActive })
        .eq('id', connectionId)

      if (error) throw error
      
      await fetchERPConnections()

    } catch (error) {
      console.error('Erro ao alterar status da conexão:', error)
    }
  }

  const deleteConnection = async (connectionId) => {
    if (!confirm('Tem certeza que deseja excluir esta conexão ERP?')) return

    try {
      const { error } = await supabase
        .from('erp_connections')
        .delete()
        .eq('id', connectionId)

      if (error) throw error
      
      await fetchERPConnections()

    } catch (error) {
      console.error('Erro ao excluir conexão:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'disconnected': return <XCircle className="w-5 h-5 text-red-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'testing': return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
      default: return <XCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Conectado'
      case 'disconnected': return 'Desconectado'
      case 'error': return 'Erro'
      case 'testing': return 'Testando...'
      default: return 'Indefinido'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sincronização ERP</h1>
          <p className="text-gray-400">
            Conecte e sincronize dados do seu sistema ERP
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conexão
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-600 bg-opacity-20">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Conexões Ativas</p>
              <p className="text-2xl font-bold text-white">
                {connections.filter(c => c.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-20">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Conectados</p>
              <p className="text-2xl font-bold text-white">
                {connections.filter(c => c.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="p-3 rounded-full bg-orange-600 bg-opacity-20 mb-4">
            <RefreshCw className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-sm font-medium text-gray-400">Última Sync</p>
          <p className="text-lg font-bold text-white">
            {connections.length > 0 
              ? new Date(Math.max(...connections.map(c => new Date(c.last_sync).getTime()))).toLocaleDateString('pt-BR')
              : '-'
            }
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="p-3 rounded-full bg-purple-600 bg-opacity-20 mb-4">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-sm font-medium text-gray-400">Produtos Sync</p>
          <p className="text-2xl font-bold text-white">
            {connections.reduce((acc, c) => acc + c.total_products, 0)}
          </p>
        </div>
      </div>

      {/* Conexões ERP */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Conexões Configuradas</h3>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Nenhuma conexão ERP configurada</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Conexão
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {connections.map((connection) => (
              <div key={connection.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="text-2xl">
                      {supportedERPs.find(erp => erp.type === connection.erp_type)?.icon || '🔧'}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white">
                        {connection.erp_name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {supportedERPs.find(erp => erp.type === connection.erp_type)?.name || connection.erp_type}
                      </p>
                      <div className="flex flex-wrap items-center mt-2 gap-4">
                        <div className="flex items-center">
                          {getStatusIcon(connection.status)}
                          <span className="ml-1 text-sm text-gray-300">
                            {getStatusText(connection.status)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {connection.total_products} produtos
                        </span>
                        <span className="text-sm text-gray-400">
                          Última sync: {formatDate(connection.last_sync)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleConnection(connection.id, connection.is_active)}
                      className={`p-2 rounded-lg transition-colors ${
                        connection.is_active 
                          ? 'text-green-400 hover:bg-green-600/20' 
                          : 'text-gray-400 hover:bg-gray-700'
                      }`}
                      title={connection.is_active ? 'Desativar' : 'Ativar'}
                    >
                      {connection.is_active ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSyncNow(connection.id)}
                      disabled={syncing || !connection.is_active}
                      className="p-2 text-orange-400 hover:bg-orange-600/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Sincronizar Agora"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedConnection(connection.id)}
                      className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteConnection(connection.id)}
                      className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logs de Sincronização */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Logs de Sincronização</h3>
        </div>

        <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
          {syncLogs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma sincronização realizada ainda</p>
            </div>
          ) : (
            syncLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.status === 'success' ? 'bg-green-500' :
                    log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  
                  <div>
                    <p className="text-white font-medium">
                      {log.sync_type.charAt(0).toUpperCase() + log.sync_type.slice(1)} Sync
                    </p>
                    <p className="text-sm text-gray-400">{log.message}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-300">
                    {log.synced_items} itens
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(log.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Adicionar Conexão */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nova Conexão ERP</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddConnection} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sistema ERP *
                </label>
                <select
                  required
                  value={newConnection.erp_type}
                  onChange={(e) => {
                    const selectedERP = supportedERPs.find(erp => erp.type === e.target.value)
                    setNewConnection({
                      ...newConnection, 
                      erp_type: e.target.value,
                      erp_name: selectedERP?.name || ''
                    })
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Selecione um ERP</option>
                  {supportedERPs.map(erp => (
                    <option key={erp.type} value={erp.type}>
                      {erp.icon} {erp.name}
                    </option>
                  ))}
                </select>
                {newConnection.erp_type && (
                  <p className="text-sm text-gray-400 mt-1">
                    {supportedERPs.find(erp => erp.type === newConnection.erp_type)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da API *
                </label>
                <input
                  type="url"
                  required
                  value={newConnection.api_endpoint}
                  onChange={(e) => setNewConnection({...newConnection, api_endpoint: e.target.value})}
                  placeholder="https://seuserp.com.br/api"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {newConnection.erp_type && supportedERPs.find(erp => erp.type === newConnection.erp_type)?.authentication_type === 'api_key' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key *
                  </label>
                  <input
                    type="password"
                    required
                    value={newConnection.api_key}
                    onChange={(e) => setNewConnection({...newConnection, api_key: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {newConnection.erp_type && supportedERPs.find(erp => erp.type === newConnection.erp_type)?.authentication_type === 'basic_auth' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Usuário *
                    </label>
                    <input
                      type="text"
                      required
                      value={newConnection.username}
                      onChange={(e) => setNewConnection({...newConnection, username: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      required
                      value={newConnection.password}
                      onChange={(e) => setNewConnection({...newConnection, password: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frequência de Sincronização
                </label>
                <select
                  value={newConnection.sync_frequency}
                  onChange={(e) => setNewConnection({...newConnection, sync_frequency: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="manual">Manual</option>
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={syncing}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50"
                >
                  {syncing ? 'Testando Conexão...' : 'Conectar ERP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}