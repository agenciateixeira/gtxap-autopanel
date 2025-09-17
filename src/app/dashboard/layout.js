'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  FileText, 
  Settings, 
  User, 
  BarChart3,
  LogOut,
  Bell,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Loader2
} from 'lucide-react'

export default function ResponsiveDashboard({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()
  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Package, label: 'Estoque', href: '/dashboard/estoque' },
    { icon: FileText, label: 'Orçamentos', href: '/dashboard/orcamentos' },
    { icon: BarChart3, label: 'Sincronizar ERP', href: '/dashboard/erp' },
    { icon: User, label: 'Perfil', href: '/dashboard/perfil' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' }
  ]

  // Verificação de autenticação primeira
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('Usuário não autenticado, redirecionando para login')
          router.push('/login')
          return
        }
        
        console.log('Usuário autenticado:', user.email)
        setIsAuthenticated(true)
        await loadUserProfile()
        await loadNotifications()
      } catch (error) {
        console.error('Erro na verificação de auth:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Mudança de auth:', event)
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false)
          router.push('/login')
        } else if (event === 'SIGNED_IN') {
          setIsAuthenticated(true)
          loadUserProfile()
          loadNotifications()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    if (!isAuthenticated) return
    
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAuthenticated])

  const loadUserProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return

      // Buscar perfil completo
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError)
      }

      setUserProfile({
        ...user,
        name: profile?.name || user.user_metadata?.name || 'Usuário',
        company: profile?.company || 'Empresa não informada',
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return

      // Simulação de notificações baseadas em dados reais
      const mockNotifications = []

      // Buscar orçamentos recentes
      const { data: recentQuotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      recentQuotes?.forEach(quote => {
        if (quote.created_from_chat) {
          mockNotifications.push({
            id: `quote_${quote.id}`,
            type: 'quote',
            title: 'Novo orçamento via Chat IA',
            message: `Orçamento ${quote.quote_number} criado para ${quote.customer_name}`,
            time: quote.created_at,
            read: false,
            icon: MessageSquare,
            color: 'text-purple-400'
          })
        }
      })

      // Buscar produtos com estoque baixo
      const { data: allProducts } = await supabase
        .from('products')
        .select('name, stock_quantity, min_stock')
        .eq('user_id', user.id)

      // Filtrar produtos com estoque baixo no lado do cliente
      const lowStockProducts = allProducts?.filter(product => 
        (product.stock_quantity || 0) <= (product.min_stock || 0)
      ).slice(0, 5)

      if (lowStockProducts && lowStockProducts.length > 0) {
        mockNotifications.push({
          id: 'low_stock',
          type: 'warning',
          title: `${lowStockProducts.length} produtos com estoque baixo`,
          message: `${lowStockProducts[0].name} e outros produtos precisam de reposição`,
          time: new Date().toISOString(),
          read: false,
          icon: AlertCircle,
          color: 'text-yellow-400'
        })
      }

      // Buscar conversas ativas
      const { data: activeChats } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)

      if (activeChats && activeChats.length > 0) {
        mockNotifications.push({
          id: 'active_chat',
          type: 'info',
          title: 'Conversa ativa no Chat IA',
          message: 'Você tem uma conversa em andamento que pode ser finalizada',
          time: activeChats[0].updated_at,
          read: false,
          icon: MessageSquare,
          color: 'text-blue-400'
        })
      }

      // Adicionar notificação de boas-vindas se for primeira vez
      if (mockNotifications.length === 0) {
        mockNotifications.push({
          id: 'welcome',
          type: 'success',
          title: 'Bem-vindo ao AutoPanel!',
          message: 'Explore todas as funcionalidades do sistema',
          time: new Date().toISOString(),
          read: false,
          icon: Check,
          color: 'text-green-400'
        })
      }

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)

    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Limpar localStorage apenas no cliente
      if (typeof window !== 'undefined') {
        window.localStorage.clear()
        window.sessionStorage.clear()
      }
      
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      alert('Erro ao sair. Tente novamente.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
    
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }

  const goToProfile = () => {
    setShowProfileMenu(false)
    router.push('/dashboard/perfil')
  }

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Agora'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U'
  }

  // Tela de carregamento durante verificação de auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não autenticado, não renderizar nada (redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 border-r border-gray-700
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AP</span>
            </div>
            <span className="text-white font-bold text-xl">AutoPanel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-sm">
                  {getInitials(userProfile?.name)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {userProfile?.name || 'Carregando...'}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {userProfile?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-white text-xl lg:text-2xl font-bold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-400 hover:text-white relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Notificações</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-orange-400 hover:text-orange-300"
                          >
                            Marcar todas como lidas
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => {
                          const Icon = notification.icon
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-gray-700 bg-opacity-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <Icon className={`w-5 h-5 mt-0.5 ${notification.color}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm">
                                    {notification.title}
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-2">
                                    {formatNotificationTime(notification.time)}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">Nenhuma notificação</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="hidden sm:flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {getInitials(userProfile?.name)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">
                    {userProfile?.name || 'Usuário'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                          {userProfile?.avatar_url ? (
                            <img 
                              src={userProfile.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium">
                              {getInitials(userProfile?.name)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {userProfile?.name}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {userProfile?.company}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={goToProfile}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        <span>Meu Perfil</span>
                      </button>
                      
                      <a
                        href="/dashboard/configuracoes"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configurações</span>
                      </a>
                      
                      <div className="border-t border-gray-700 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors w-full text-left disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Profile Button */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="sm:hidden text-gray-400 hover:text-white"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(userProfile?.name)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}