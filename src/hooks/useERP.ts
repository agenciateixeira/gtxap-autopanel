// src/hooks/useERP.ts
import { useState, useEffect } from 'react'
import { ERPService, ERPConnection } from '@/lib/erp-service'

export const useERP = () => {
  const [connections, setConnections] = useState<ERPConnection[]>([])
  const [syncLogs, setSyncLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchConnections = async () => {
    try {
      const data = await ERPService.getConnections()
      setConnections(data)
    } catch (error) {
      console.error('Erro ao buscar conexões:', error)
    }
  }

  const fetchSyncLogs = async () => {
    try {
      const data = await ERPService.getSyncLogs()
      setSyncLogs(data)
    } catch (error) {
      console.error('Erro ao buscar logs:', error)
    }
  }

  const testConnection = async (connectionData: any): Promise<boolean> => {
    return await ERPService.testConnection(connectionData)
  }

  const syncData = async (connectionId: string, syncType: string) => {
    setSyncing(true)
    try {
      const result = await ERPService.syncData(connectionId, syncType)
      await fetchConnections()
      await fetchSyncLogs()
      return result
    } catch (error) {
      console.error('Erro na sincronização:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchConnections(), fetchSyncLogs()])
      setLoading(false)
    }
    loadData()
  }, [])

  return {
    connections,
    syncLogs,
    loading,
    syncing,
    fetchConnections,
    fetchSyncLogs,
    testConnection,
    syncData
  }
}