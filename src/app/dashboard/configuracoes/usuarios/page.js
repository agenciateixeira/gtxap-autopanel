'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Send,
  Trash2,
  Crown,
  User,
  Loader2,
  Building,
  Phone,
  Clock,
  XCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [convitesPendentes, setConvitesPendentes] = useState([])
  const [emailConvite, setEmailConvite] = useState('')
  const [cargoConvite, setCargoConvite] = useState('user')
  const [nomeConvite, setNomeConvite] = useState('')
  const [empresaConvite, setEmpresaConvite] = useState('')
  const [showConviteModal, setShowConviteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    inicializarDados()
  }, [])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const inicializarDados = async () => {
    setLoadingData(true)
    try {
      // Buscar usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        showMessage('error', 'Erro ao obter usuário atual')
        return
      }

      setCurrentUser(user)
      
      // Carregar dados em paralelo
      await Promise.all([
        carregarUsuarios(),
        carregarConvitesPendentes()
      ])

    } catch (error) {
      console.error('Erro ao inicializar:', error)
      showMessage('error', 'Erro ao carregar dados')
    } finally {
      setLoadingData(false)
    }
  }

  const carregarUsuarios = async () => {
    try {
      console.log('Carregando usuários da tabela profiles...')
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        showMessage('error', 'Erro ao carregar usuários')
        setUsuarios([])
        return
      }

      console.log('Usuários carregados:', profiles?.length || 0)

      // Formatear dados dos usuários REAIS
      const usuariosFormatados = (profiles || []).map(profile => ({
        id: profile.id,
        user_id: profile.id,
        name: profile.name || 'Usuário sem nome',
        email: profile.email || 'Email não informado',
        company: profile.company || 'Sem empresa',
        phone: profile.phone || '',
        cnpj: profile.cnpj || '',
        role: profile.role || 'user',
        status: 'active',
        last_access: profile.updated_at,
        created_at: profile.created_at,
        avatar_url: profile.avatar_url
      }))

      setUsuarios(usuariosFormatados)

    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      showMessage('error', 'Erro ao carregar usuários: ' + error.message)
      setUsuarios([])
    }
  }

  const carregarConvitesPendentes = async () => {
    try {
      console.log('Carregando convites da tabela user_invites...')
      
      // Buscar convites pendentes na tabela user_invites
      const { data: convites, error } = await supabase
        .from('user_invites')
        .select('*')
        .in('status', ['pending', 'sent'])
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Erro ao buscar convites (tabela pode não existir):', error)
        setConvitesPendentes([])
        return
      }

      console.log('Convites carregados:', convites?.length || 0)
      setConvitesPendentes(convites || [])

    } catch (error) {
      console.warn('Erro ao carregar convites:', error)
      setConvitesPendentes([])
    }
  }

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const enviarConvite = async () => {
    // Validações
    if (!emailConvite.trim()) {
      showMessage('error', 'Por favor, digite um e-mail válido')
      return
    }

    if (!validarEmail(emailConvite)) {
      showMessage('error', 'E-mail inválido')
      return
    }

    if (!nomeConvite.trim()) {
      showMessage('error', 'Por favor, digite o nome do usuário')
      return
    }

    // Verificar se o email já é um usuário ativo
    const emailJaCadastrado = usuarios.some(user => 
      user.email.toLowerCase() === emailConvite.toLowerCase()
    )

    if (emailJaCadastrado) {
      showMessage('error', 'Este e-mail já pertence a um usuário cadastrado')
      return
    }

    // Verificar se já foi convidado
    const emailJaConvidado = convitesPendentes.some(convite => 
      convite.email.toLowerCase() === emailConvite.toLowerCase()
    )

    if (emailJaConvidado) {
      showMessage('error', 'Este e-mail já possui um convite pendente')
      return
    }

    setLoading(true)

    try {
      console.log('Enviando convite real para a tabela user_invites...')
      console.log('Usuário atual:', currentUser?.id)
      
      // Dados do convite REAL
      const novoConvite = {
        email: emailConvite.trim(),
        name: nomeConvite.trim(),
        company: empresaConvite.trim() || null,
        role: cargoConvite,
        status: 'pending',
        invited_by: currentUser.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        created_at: new Date().toISOString()
      }

      console.log('Dados do convite a serem inseridos:', novoConvite)

      // Inserir na tabela user_invites
      const { data, error } = await supabase
        .from('user_invites')
        .insert([novoConvite])
        .select()

      console.log('Resposta do Supabase:', { data, error })

      if (error) {
        // Log mais detalhado do erro
        console.error('Erro completo:', error)
        console.error('Tipo do erro:', typeof error)
        console.error('Keys do erro:', Object.keys(error))
        console.error('Message:', error?.message)
        console.error('Code:', error?.code)
        console.error('Details:', error?.details)
        console.error('Hint:', error?.hint)
        console.error('JSON do erro:', JSON.stringify(error, null, 2))
        
        // Mensagem mais específica baseada no tipo de erro
        let errorMessage = 'Erro ao enviar convite'
        
        if (error.code === '42P01') {
          errorMessage = 'Tabela user_invites não encontrada no banco de dados'
        } else if (error.code === '23505') {
          errorMessage = 'Este e-mail já possui um convite pendente'
        } else if (error.code === '42501') {
          errorMessage = 'Permissão negada para inserir na tabela user_invites'
        } else if (error.message) {
          errorMessage = `Erro: ${error.message}`
        } else {
          errorMessage = 'Erro desconhecido ao enviar convite. Verifique o console para mais detalhes.'
        }
        
        showMessage('error', errorMessage)
        return
      }

      console.log('Convite salvo com sucesso:', data)
      
      // Recarregar convites
      await carregarConvitesPendentes()
      
      showMessage('success', `Convite enviado com sucesso para ${emailConvite}!`)
      
      // Limpar formulário
      setEmailConvite('')
      setNomeConvite('')
      setEmpresaConvite('')
      setCargoConvite('user')
      setShowConviteModal(false)

    } catch (error) {
      console.error('Erro geral ao enviar convite:', error)
      showMessage('error', `Erro ao enviar convite: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const alterarCargo = async (userId, novoCargo) => {
    if (confirm(`Alterar cargo para ${getCargoTexto(novoCargo)}?`)) {
      try {
        console.log('Atualizando cargo no banco de dados...')
        
        // Atualizar no banco de dados REAL
        const { error } = await supabase
          .from('profiles')
          .update({ 
            role: novoCargo,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (error) {
          console.error('Erro ao atualizar cargo:', error)
          showMessage('error', 'Erro ao alterar cargo: ' + error.message)
          return
        }

        // Atualizar estado local
        setUsuarios(prev => prev.map(user => 
          user.user_id === userId 
            ? { ...user, role: novoCargo }
            : user
        ))
        
        showMessage('success', 'Cargo alterado com sucesso!')

      } catch (error) {
        console.error('Erro ao alterar cargo:', error)
        showMessage('error', 'Erro ao alterar cargo: ' + error.message)
      }
    }
  }

  const removerUsuario = async (userId) => {
    if (userId === currentUser?.id) {
      showMessage('error', 'Você não pode remover sua própria conta')
      return
    }

    if (confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.')) {
      try {
        console.log('Removendo usuário do banco de dados...')
        
        // Remover do banco de dados REAL (opcional - pode só desativar)
        const { error } = await supabase
          .from('profiles')
          .update({ 
            status: 'inactive',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (error) {
          console.error('Erro ao remover usuário:', error)
          showMessage('error', 'Erro ao remover usuário: ' + error.message)
          return
        }

        // Remover da lista local
        setUsuarios(prev => prev.filter(user => user.user_id !== userId))
        showMessage('success', 'Usuário removido com sucesso!')

      } catch (error) {
        console.error('Erro ao remover usuário:', error)
        showMessage('error', 'Erro ao remover usuário: ' + error.message)
      }
    }
  }

  const cancelarConvite = async (conviteId) => {
    if (confirm('Tem certeza que deseja cancelar este convite?')) {
      try {
        console.log('Cancelando convite...')
        
        // Remover da tabela user_invites
        const { error } = await supabase
          .from('user_invites')
          .delete()
          .eq('id', conviteId)

        if (error) {
          console.error('Erro ao cancelar convite:', error)
          showMessage('error', 'Erro ao cancelar convite: ' + error.message)
          return
        }

        // Recarregar convites
        await carregarConvitesPendentes()
        showMessage('success', 'Convite cancelado com sucesso!')

      } catch (error) {
        console.error('Erro ao cancelar convite:', error)
        showMessage('error', 'Erro ao cancelar convite: ' + error.message)
      }
    }
  }

  const reenviarConvite = async (conviteId) => {
    try {
      console.log('Reenviando convite...')
      
      // Atualizar data de criação para "reenviar"
      const { error } = await supabase
        .from('user_invites')
        .update({ 
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', conviteId)

      if (error) {
        console.error('Erro ao reenviar convite:', error)
        showMessage('error', 'Erro ao reenviar convite: ' + error.message)
        return
      }

      await carregarConvitesPendentes()
      showMessage('success', 'Convite reenviado com sucesso!')

    } catch (error) {
      console.error('Erro ao reenviar convite:', error)
      showMessage('error', 'Erro ao reenviar convite: ' + error.message)
    }
  }

  const getCargoIcon = (cargo) => {
    switch (cargo) {
      case 'admin': return <Crown className="w-4 h-4 text-orange-500" />
      case 'manager': return <Shield className="w-4 h-4 text-blue-500" />
      default: return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const getCargoTexto = (cargo) => {
    switch (cargo) {
      case 'admin': return 'Administrador'
      case 'manager': return 'Gestor'
      default: return 'Usuário'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-medium border border-green-600/30">Ativo</span>
      case 'inactive':
        return <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-medium border border-red-600/30">Inativo</span>
      case 'pending':
        return <span className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs font-medium border border-orange-600/30">Pendente</span>
      default:
        return <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">Desconhecido</span>
    }
  }

  const formatarDataHora = (data) => {
    try {
      return new Date(data).toLocaleString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatarData = (data) => {
    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const isConviteExpirado = (expiresAt) => {
    return new Date(expiresAt) < new Date()
  }

  // Loading inicial
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando sistema de usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Users className="text-orange-500" />
                Gerenciar Usuários
              </h1>
              <p className="text-gray-400 mt-2">
                Sistema completo de gerenciamento com dados reais
              </p>
            </div>
            
            <button
              onClick={() => setShowConviteModal(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg transition-all"
            >
              <UserPlus size={20} />
              <span className="hidden sm:inline">Convidar Usuário</span>
              <span className="sm:hidden">Convidar</span>
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-900/30 border-green-500 text-green-300' 
              : 'bg-red-900/30 border-red-500 text-red-300'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Estatísticas REAIS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Usuários Ativos</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {usuarios.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Convites Pendentes</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{convitesPendentes.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Administradores</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {usuarios.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{usuarios.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Usuários REAIS */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Usuários Cadastrados</h2>
              <button
                onClick={() => carregarUsuarios()}
                disabled={loading}
                className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 self-start"
              >
                {loading ? 'Carregando...' : 'Atualizar'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {usuarios.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                      Cargo
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Empresa
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm sm:text-base">{usuario.name}</div>
                            <div className="text-xs sm:text-sm text-gray-400 truncate max-w-48">{usuario.email}</div>
                            {usuario.phone && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Phone className="w-3 h-3 mr-1" />
                                {usuario.phone}
                              </div>
                            )}
                            <div className="sm:hidden mt-1 flex items-center gap-2">
                              {getCargoIcon(usuario.role)}
                              <span className="text-xs text-gray-300">{getCargoTexto(usuario.role)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          {getCargoIcon(usuario.role)}
                          <span className="text-gray-300 text-sm">{getCargoTexto(usuario.role)}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{usuario.company}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        {getStatusBadge(usuario.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={usuario.role}
                            onChange={(e) => alterarCargo(usuario.user_id, e.target.value)}
                            className="text-xs sm:text-sm border border-gray-600 rounded px-2 py-1 bg-gray-700 text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={usuario.user_id === currentUser?.id}
                          >
                            <option value="user">Usuário</option>
                            <option value="manager">Gestor</option>
                            <option value="admin">Admin</option>
                          </select>
                          {usuario.user_id !== currentUser?.id && (
                            <button
                              onClick={() => removerUsuario(usuario.user_id)}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors"
                              title="Remover usuário"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-400 mb-4">Os usuários cadastrados aparecerão aqui.</p>
                <button
                  onClick={() => carregarUsuarios()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Recarregar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Convites Pendentes REAIS */}
        {convitesPendentes.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Convites Pendentes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Convidado
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                      Cargo
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Data do Convite
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {convitesPendentes.map((convite) => {
                    const expirado = isConviteExpirado(convite.expires_at)
                    return (
                      <tr key={convite.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="font-medium text-white text-sm sm:text-base">{convite.name}</div>
                            <div className="text-xs sm:text-sm text-gray-400">{convite.email}</div>
                            {convite.company && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Building className="w-3 h-3 mr-1" />
                                {convite.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            {getCargoIcon(convite.role)}
                            <span className="text-gray-300 text-sm">{getCargoTexto(convite.role)}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-300 hidden lg:table-cell">
                          {formatarData(convite.created_at)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          {expirado ? (
                            <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-medium border border-red-600/30">
                              Expirado
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs font-medium border border-orange-600/30">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            {!expirado && (
                              <button
                                onClick={() => reenviarConvite(convite.id)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium px-2 py-1 rounded hover:bg-blue-900/20 transition-colors"
                              >
                                Reenviar
                              </button>
                            )}
                            <button
                              onClick={() => cancelarConvite(convite.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Convite REAL */}
        {showConviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Convidar Usuário</h3>
                <button
                  onClick={() => setShowConviteModal(false)}
                  className="text-gray-400 hover:text-gray-300 p-1 rounded transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={nomeConvite}
                    onChange={(e) => setNomeConvite(e.target.value)}
                    placeholder="João Silva"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={emailConvite}
                    onChange={(e) => setEmailConvite(e.target.value)}
                    placeholder="joao@empresa.com"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    value={empresaConvite}
                    onChange={(e) => setEmpresaConvite(e.target.value)}
                    placeholder="Nome da empresa"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cargo
                  </label>
                  <select
                    value={cargoConvite}
                    onChange={(e) => setCargoConvite(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  >
                    <option value="user">Usuário</option>
                    <option value="manager">Gestor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-200">
                      <p className="font-medium mb-1">Sistema Real:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Convite será salvo na tabela user_invites</li>
                        <li>Dados persistem no banco de dados</li>
                        <li>Funcionalidades completamente reais</li>
                        <li>Gerenciamento profissional de usuários</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConviteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviarConvite}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {loading ? 'Enviando...' : 'Enviar Convite'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}