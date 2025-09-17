// src/lib/erp-service.ts
import { supabase } from './supabase'

export interface ERPConnection {
  id: string
  user_id: string
  erp_name: string
  erp_type: string
  api_endpoint: string
  status: 'connected' | 'disconnected' | 'error' | 'testing'
  last_sync: string
  total_products: number
  sync_frequency: 'manual' | 'hourly' | 'daily' | 'weekly'
  is_active: boolean
}

export interface ERPProduct {
  code: string
  name: string
  description?: string
  category?: string
  brand?: string
  unit: string
  stock_quantity: number
  min_stock: number
  price: number
  cost: number
  supplier?: string
  location?: string
}

export class ERPService {
  
  static async getConnections(): Promise<ERPConnection[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('erp_connections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createConnection(connectionData: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('erp_connections')
      .insert({
        ...connectionData,
        user_id: user.id
      })

    if (error) throw error
  }

  static async testConnection(connectionData: any): Promise<boolean> {
    try {
      const response = await fetch('/api/erp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionData)
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Erro ao testar conexão:', error)
      return false
    }
  }

  static async syncData(connectionId: string, syncType: string): Promise<any> {
    const response = await fetch('/api/erp/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId, syncType })
    })

    if (!response.ok) {
      throw new Error('Falha na sincronização')
    }

    return response.json()
  }

  static async getSyncLogs(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('sync_logs')
      .select(`
        *,
        erp_connections!inner(erp_name)
      `)
      .eq('erp_connections.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  }

  static getERPIcon(erpType: string): string {
    const icons: { [key: string]: string } = {
      'totvs_protheus': '🏢',
      'sap_b1': '💼',
      'senior': '🔧',
      'sankhya': '☁️',
      'microsiga': '🖥️',
      'bling': '🚀',
      'tiny': '📦',
      'omie': '⚡'
    }
    return icons[erpType] || '🔧'
  }

  static getERPName(erpType: string): string {
    const names: { [key: string]: string } = {
      'totvs_protheus': 'TOTVS Protheus',
      'sap_b1': 'SAP Business One',
      'senior': 'Senior Sistemas',
      'sankhya': 'Sankhya',
      'microsiga': 'Microsiga',
      'bling': 'Bling',
      'tiny': 'Tiny ERP',
      'omie': 'Omie'
    }
    return names[erpType] || erpType
  }
}