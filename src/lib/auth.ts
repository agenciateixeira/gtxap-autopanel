// src/lib/auth.ts
import { supabase } from './supabase'

export const auth = {
  async signUp(email: string, password: string, metadata: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error

    // Criar perfil do usuário
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: metadata.name,
          company: metadata.company,
          cnpj: metadata.cnpj,
          phone: metadata.phone
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
      }
    }

    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getProfile() {
    const { user } = await this.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }

    return data
  }
}