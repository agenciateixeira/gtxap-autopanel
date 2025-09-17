// src/app/dashboard/layout.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, supabase } from '@/lib/supabase'
import AuthGuard from '@/components/auth/AuthGuard'
import { 
  Home, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  TrendingUp,
  LogOut,
  User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await auth.getUser()
      setUser(currentUser)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut()
      if (error) throw error
      
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/estoque', icon: Package, label: 'Estoque' },
    { href: '/dashboard/orcamentos', icon: FileText, label: 'Orçamentos' },
    { href: '/dashboard/erp', icon: BarChart3, label: 'ERP' },
    { href: '/dashboard/kpi', icon: TrendingUp, label: 'KPIs' },
    { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white">AutoPanel</h1>
            </div>

            {/* User Info */}
            {user && (
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-6 py-6">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-orange-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="px-6 py-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}