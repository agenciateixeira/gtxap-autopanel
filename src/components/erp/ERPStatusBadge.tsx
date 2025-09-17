// src/components/erp/ERPStatusBadge.tsx
import React from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface ERPStatusBadgeProps {
  status: 'connected' | 'disconnected' | 'error' | 'testing'
  className?: string
}

export const ERPStatusBadge: React.FC<ERPStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: 'Conectado',
          classes: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'disconnected':
        return {
          icon: XCircle,
          text: 'Desconectado',
          classes: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erro',
          classes: 'bg-red-100 text-red-800 border-red-200'
        }
      case 'testing':
        return {
          icon: RefreshCw,
          text: 'Testando...',
          classes: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      default:
        return {
          icon: XCircle,
          text: 'Indefinido',
          classes: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes} ${className}`}>
      <Icon className={`w-3 h-3 mr-1 ${status === 'testing' ? 'animate-spin' : ''}`} />
      {config.text}
    </span>
  )
}