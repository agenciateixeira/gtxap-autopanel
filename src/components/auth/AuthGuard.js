// components/auth/AuthGuard.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.getUser()
        
        if (!currentUser) {
          console.log('Usuário não autenticado')
          router.push('/login')
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listener para mudanças de autenticação usando o Supabase diretamente
    const { supabase } = require('@/lib/supabase')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          router.push('/login')
        } else if (event === 'SIGNED_IN') {
          setUser(session.user)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário, não renderiza nada (redirecionamento já foi feito)
  if (!user) {
    return null
  }

  // Se há usuário, renderiza o conteúdo protegido
  return children
}