import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Funções de autenticação
export const auth = {
  signUp: async (email, password, userData) => {
    try {
      // Teste básico sem metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
        // Removendo options temporariamente para teste
      })

      if (authError) {
        console.error('Erro na autenticação:', authError)
        console.error('Detalhes do erro:', JSON.stringify(authError, null, 2))
        return { data: null, error: authError }
      }

      console.log('✅ Usuário criado no auth:', authData.user?.id)
      return { data: authData, error: null }
      
    } catch (error) {
      console.error('Erro geral no signUp:', error)
      return { data: null, error: new Error('Database error saving new user') }
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
      }

      return { data, error }
    } catch (error) {
      console.error('Erro geral no signIn:', error)
      return { data: null, error: new Error('Erro ao fazer login') }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro no logout:', error)
      }
      
      return { error }
    } catch (error) {
      console.error('Erro geral no signOut:', error)
      return { error: new Error('Erro ao fazer logout') }
    }
  },

  getUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Erro ao obter usuário:', error)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Erro geral ao obter usuário:', error)
      return null
    }
  },

  // Função para obter o perfil completo do usuário
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao obter perfil:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro geral ao obter perfil:', error)
      return { data: null, error: new Error('Erro ao carregar perfil') }
    }
  },

  // Função para atualizar o perfil do usuário
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .update(updates)
        .eq('id', userId)
        .select()

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro geral ao atualizar perfil:', error)
      return { data: null, error: new Error('Erro ao atualizar perfil') }
    }
  }
}