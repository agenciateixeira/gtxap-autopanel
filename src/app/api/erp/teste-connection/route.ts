import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { erp_type, api_endpoint, api_key, username, password } = await request.json()

    // Validar dados obrigatórios
    if (!erp_type || !api_endpoint) {
      return NextResponse.json(
        { success: false, message: 'Dados obrigatórios não informados' },
        { status: 400 }
      )
    }

    // Simular teste de conexão baseado no tipo de ERP
    const testResult = await testERPConnection({
      erp_type,
      api_endpoint,
      api_key,
      username,
      password
    })

    return NextResponse.json(testResult)

  } catch (error) {
    console.error('Erro ao testar conexão ERP:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function testERPConnection(connectionData: any) {
  const { erp_type, api_endpoint, api_key, username, password } = connectionData

  try {
    let headers: any = {
      'Content-Type': 'application/json',
      'User-Agent': 'AutoPanel-ERP-Connector/1.0'
    }

    // Configurar autenticação baseada no tipo de ERP
    switch (erp_type) {
      case 'totvs_protheus':
        headers['Authorization'] = `Bearer ${api_key}`
        break
      case 'sap_b1':
      case 'microsiga':
        headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        break
      case 'sankhya':
      case 'bling':
      case 'tiny':
      case 'omie':
        headers['Authorization'] = `Bearer ${api_key}`
        break
      case 'senior':
        headers['Authorization'] = `OAuth ${api_key}`
        break
      default:
        headers['Authorization'] = `Bearer ${api_key}`
    }

    // Tentar fazer uma requisição de teste para o endpoint
    const testEndpoint = getTestEndpoint(erp_type, api_endpoint)
    
    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000) // 10 segundos de timeout
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: 'Conexão estabelecida com sucesso',
        data: {
          status: response.status,
          version: data.version || 'Não informado',
          endpoint: testEndpoint
        }
      }
    } else {
      return {
        success: false,
        message: `Falha na conexão: ${response.status} - ${response.statusText}`
      }
    }

  } catch (error: any) {
    // Em desenvolvimento, simular conexão bem-sucedida para teste
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'Conexão simulada estabelecida (modo desenvolvimento)',
        data: {
          status: 200,
          version: 'Simulado v1.0',
          endpoint: api_endpoint
        }
      }
    }

    return {
      success: false,
      message: `Erro de conexão: ${error.message}`
    }
  }
}

function getTestEndpoint(erp_type: string, base_url: string): string {
  const endpoints: { [key: string]: string } = {
    'totvs_protheus': '/api/health',
    'sap_b1': '/api/status',
    'senior': '/api/ping',
    'sankhya': '/api/health',
    'microsiga': '/api/status',
    'bling': '/api/situacao',
    'tiny': '/api/info',
    'omie': '/api/geral/ping'
  }

  const endpoint = endpoints[erp_type] || '/api/health'
  return `${base_url.replace(/\/$/, '')}${endpoint}`
}