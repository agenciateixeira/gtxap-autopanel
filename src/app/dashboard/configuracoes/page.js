'use client'

import { useState, useEffect } from 'react'
import { supabase, auth } from '@/lib/supabase'
import { 
  Settings, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Save, 
  Eye, 
  EyeOff,
  Shield,
  Key,
  Bell,
  Palette,
  Database,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  LogOut,
  Globe,
  Monitor,
  Moon,
  Sun,
  Languages,
  Clock,
  Users
} from 'lucide-react'

// Importar o componente de usuários
import UsuariosPage from './usuarios/page'

export default function ConfiguracoesPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Estados do formulário
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    cnpj: '',
    phone: '',
    avatar_url: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState({
    notifications_email: true,
    notifications_browser: true,
    theme: 'dark',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  })

  const [stats, setStats] = useState({
    quotes: 0,
    products: 0,
    messages: 0
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Buscar usuário atual
      const user = await auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      if (profile) {
        setProfile(profile)
        setProfileData({
          name: profile.name || '',
          email: profile.email || user.email || '',
          company: profile.company || '',
          cnpj: profile.cnpj || '',
          phone: profile.phone || '',
          avatar_url: profile.avatar_url || ''
        })

        // Carregar preferências se existirem
        if (profile.preferences) {
          setPreferences({
            ...preferences,
            ...profile.preferences
          })
        }
      } else {
        // Criar perfil se não existir
        const newProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          company: user.user_metadata?.company || '',
          cnpj: user.user_metadata?.cnpj || '',
          phone: user.user_metadata?.phone || '',
          preferences: preferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError

        setProfile(createdProfile)
        setProfileData({
          name: createdProfile.name || '',
          email: createdProfile.email || '',
          company: createdProfile.company || '',
          cnpj: createdProfile.cnpj || '',
          phone: createdProfile.phone || '',
          avatar_url: createdProfile.avatar_url || ''
        })
      }

      // Carregar estatísticas após carregar o usuário
      await loadStats()

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      showMessage('error', 'Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateCNPJ = (cnpj) => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return cnpjRegex.test(cnpj)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const saveProfile = async () => {
    try {
      setSaving(true)

      // Validações
      if (!profileData.name.trim()) {
        showMessage('error', 'Nome é obrigatório')
        return
      }

      if (!validateEmail(profileData.email)) {
        showMessage('error', 'Email inválido')
        return
      }

      if (profileData.cnpj && !validateCNPJ(profileData.cnpj)) {
        showMessage('error', 'CNPJ inválido')
        return
      }

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name.trim(),
          company: profileData.company.trim(),
          cnpj: profileData.cnpj,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Atualizar email no auth se mudou
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email
        })

        if (emailError) throw emailError
        showMessage('success', 'Perfil atualizado! Verifique seu novo email para confirmar a alteração.')
      } else {
        showMessage('success', 'Perfil atualizado com sucesso!')
      }

      // Recarregar dados
      await loadUserData()

    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      showMessage('error', 'Erro ao salvar perfil: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const loadStats = async () => {
    if (!user) return

    try {
      // Buscar estatísticas do usuário
      const [quotesData, productsData, messagesData] = await Promise.all([
        supabase.from('quotes').select('id').eq('user_id', user.id),
        supabase.from('products').select('id').eq('user_id', user.id),
        supabase.from('chat_messages').select('id').eq('user_id', user.id)
      ])

      setStats({
        quotes: quotesData.data?.length || 0,
        products: productsData.data?.length || 0,
        messages: messagesData.data?.length || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const savePreferences = async () => {
    try {
      setSaving(true)

      // Atualizar preferências no banco
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Aplicar tema
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      showMessage('success', 'Preferências salvas com sucesso!')

    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
      showMessage('error', 'Erro ao salvar preferências: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    try {
      setSaving(true)

      // Validações
      if (!passwordData.currentPassword) {
        showMessage('error', 'Senha atual é obrigatória')
        return
      }

      if (!validatePassword(passwordData.newPassword)) {
        showMessage('error', 'Nova senha deve ter pelo menos 6 caracteres')
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showMessage('error', 'Confirmação de senha não confere')
        return
      }

      if (passwordData.newPassword === passwordData.currentPassword) {
        showMessage('error', 'A nova senha deve ser diferente da atual')
        return
      }

      // Atualizar senha
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      showMessage('success', 'Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      showMessage('error', 'Erro ao alterar senha: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
      try {
        const { error } = await auth.signOut()
        if (error) throw error
        window.location.href = '/login'
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        showMessage('error', 'Erro ao sair da conta')
      }
    }
  }

  const deleteAccount = async () => {
    const confirmation = prompt(
      'ATENÇÃO: Esta ação é irreversível!\n\nTodos os seus dados serão permanentemente excluídos, incluindo:\n- Perfil e informações pessoais\n- Todos os orçamentos\n- Produtos do estoque\n- Conversas do chat\n\nPara confirmar, digite "EXCLUIR CONTA" (sem aspas):'
    )

    if (confirmation !== 'EXCLUIR CONTA') {
      showMessage('error', 'Confirmação inválida. Conta não foi excluída.')
      return
    }

    try {
      setSaving(true)

      // Excluir dados das tabelas relacionadas
      const tables = ['chat_messages', 'quotes', 'products', 'profiles']
      
      for (const table of tables) {
        try {
          await supabase
            .from(table)
            .delete()
            .eq(table === 'chat_messages' ? 'conversation_id' : 'user_id', user.id)
        } catch (error) {
          console.warn(`Erro ao excluir dados de ${table}:`, error)
        }
      }

      showMessage('success', 'Conta excluída com sucesso. Você será redirecionado...')
      
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)

    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      showMessage('error', 'Erro ao excluir conta: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const exportData = async () => {
    try {
      setSaving(true)
      
      // Buscar todos os dados do usuário usando suas tabelas existentes
      const [profileData, quotesData, productsData, messagesData, quoteItemsData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id),
        supabase.from('quotes').select('*').eq('user_id', user.id),
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('chat_messages').select('*').eq('user_id', user.id),
        supabase.from('quote_items').select('*')
      ])

      const exportData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        profile: profileData.data?.[0] || null,
        quotes: quotesData.data || [],
        products: productsData.data || [],
        chat_messages: messagesData.data || [],
        quote_items: quoteItemsData.data || []
      }

      // Download como JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `autopanel-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      showMessage('success', 'Dados exportados com sucesso!')

    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      showMessage('error', 'Erro ao exportar dados')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'data', label: 'Dados', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center mb-2">
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 mr-4 text-orange-500" />
            Configurações
          </h1>
          <p className="text-gray-400 text-lg">
            Gerencie sua conta e personalize sua experiência
          </p>
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
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              {/* User Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {profileData.name || 'Usuário'}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {profileData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8">
              
              {/* Perfil Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Informações do Perfil</h2>
                    <p className="text-gray-400">Atualize suas informações pessoais e empresariais</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building className="w-4 h-4 inline mr-1" />
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="Nome da sua empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        value={profileData.cnpj}
                        onChange={(e) => setProfileData({...profileData, cnpj: formatCNPJ(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="00.000.000/0001-00"
                        maxLength="18"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: formatPhone(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="(11) 99999-9999"
                        maxLength="15"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Segurança Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Segurança da Conta</h2>
                    <p className="text-gray-400">Gerencie sua senha e configurações de segurança</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Alterar Senha
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Senha Atual *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                            placeholder="Digite sua senha atual"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nova Senha *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                            placeholder="Digite a nova senha (min. 6 caracteres)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirmar Nova Senha *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                            placeholder="Confirme a nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={changePassword}
                        disabled={saving}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Alterando...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5 mr-2" />
                            Alterar Senha
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Sair da Conta</h3>
                    <p className="text-gray-300 mb-4">
                      Desconecte-se de todos os dispositivos e termine sua sessão atual.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold flex items-center"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}

              {/* Preferências Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Preferências</h2>
                    <p className="text-gray-400">Personalize sua experiência no AutoPanel</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notificações
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Notificações por Email</p>
                          <p className="text-gray-400 text-sm">Receba atualizações importantes por email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications_email}
                            onChange={(e) => setPreferences({...preferences, notifications_email: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Notificações do Navegador</p>
                          <p className="text-gray-400 text-sm">Receba notificações push no navegador</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications_browser}
                            onChange={(e) => setPreferences({...preferences, notifications_browser: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Aparência
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <Monitor className="w-4 h-4 inline mr-1" />
                          Tema
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setPreferences({...preferences, theme: 'dark'})}
                            className={`p-4 border rounded-lg transition-all duration-200 flex items-center justify-center ${
                              preferences.theme === 'dark'
                                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            <Moon className="w-5 h-5 mr-2" />
                            Escuro
                          </button>
                          <button
                            onClick={() => setPreferences({...preferences, theme: 'light'})}
                            className={`p-4 border rounded-lg transition-all duration-200 flex items-center justify-center ${
                              preferences.theme === 'light'
                                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            <Sun className="w-5 h-5 mr-2" />
                            Claro
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Localização
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Languages className="w-4 h-4 inline mr-1" />
                          Idioma
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        >
                          <option value="pt-BR">Português (BR)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Fuso Horário
                        </label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        >
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/New_York">New York (GMT-5)</option>
                          <option value="Europe/London">London (GMT+0)</option>
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={savePreferences}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Salvar Preferências
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Usuários Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <Users className="w-6 h-6 mr-3 text-orange-500" />
                      Gerenciar Usuários
                    </h2>
                    <p className="text-gray-400">Convide e gerencie colaboradores da sua empresa</p>
                  </div>

                  <div className="bg-gray-900 rounded-lg -m-4 sm:-m-6 lg:-m-8">
                    <UsuariosPage />
                  </div>
                </div>
              )}

              {/* Dados Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Gerenciamento de Dados</h2>
                    <p className="text-gray-400">Exporte, importe ou exclua seus dados</p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      Exportar Dados
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Baixe uma cópia de todos os seus dados em formato JSON. Inclui perfil, orçamentos, produtos e conversas.
                    </p>
                    <button
                      onClick={exportData}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Exportar Dados
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Estatísticas da Conta
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {profile?.created_at ? Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)) : 0}
                        </div>
                        <div className="text-gray-400 text-sm">Dias de uso</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{stats.quotes}</div>
                        <div className="text-gray-400 text-sm">Orçamentos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.products}</div>
                        <div className="text-gray-400 text-sm">Produtos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{stats.messages}</div>
                        <div className="text-gray-400 text-sm">Mensagens</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Zona de Perigo
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Ações irreversíveis que afetarão permanentemente sua conta.
                    </p>
                    
                    <button
                      onClick={deleteAccount}
                      disabled={saving}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5 mr-2" />
                          Excluir Conta Permanentemente
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}