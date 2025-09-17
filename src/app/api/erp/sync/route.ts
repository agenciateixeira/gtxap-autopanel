import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { connectionId, syncType } = await request.json()

    if (!connectionId || !syncType) {
      return NextResponse.json(
        { success: false, message: 'Parâmetros obrigatórios não informados' },
        { status: 400 }
      )
    }

    // Buscar dados da conexão
    const { data: connection, error: connectionError } = await supabase
      .from('erp_connections')
      .select('*')
      .eq('id', connectionId)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { success: false, message: 'Conexão ERP não encontrada' },
        { status: 404 }
      )
    }

    // Executar sincronização
    const syncResult = await performSync(connection, syncType)

    // Registrar log da sincronização
    await supabase
      .from('sync_logs')
      .insert({
        erp_connection_id: connectionId,
        sync_type: syncType,
        status: syncResult.success ? 'success' : 'error',
        message: syncResult.message,
        synced_items: syncResult.syncedItems || 0
      })

    // Atualizar última sincronização
    if (syncResult.success) {
      await supabase
        .from('erp_connections')
        .update({
          last_sync: new Date().toISOString(),
          total_products: syncResult.syncedItems || 0
        })
        .eq('id', connectionId)
    }

    return NextResponse.json(syncResult)

  } catch (error) {
    console.error('Erro na sincronização ERP:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function performSync(connection: any, syncType: string) {
  try {
    let syncedItems = 0
    let message = ''

    switch (syncType) {
      case 'products':
        const productsResult = await syncProducts(connection)
        syncedItems = productsResult.count
        message = productsResult.message
        break
      
      case 'orders':
        const ordersResult = await syncOrders(connection)
        syncedItems = ordersResult.count
        message = ordersResult.message
        break
      
      case 'customers':
        const customersResult = await syncCustomers(connection)
        syncedItems = customersResult.count
        message = customersResult.message
        break
      
      case 'full':
        const fullResult = await syncAll(connection)
        syncedItems = fullResult.count
        message = fullResult.message
        break
      
      default:
        return {
          success: false,
          message: 'Tipo de sincronização não suportado'
        }
    }

    return {
      success: true,
      message,
      syncedItems
    }

  } catch (error: any) {
    return {
      success: false,
      message: `Erro durante sincronização: ${error.message}`
    }
  }
}

async function syncProducts(connection: any) {
  try {
    // Em desenvolvimento, simular dados
    if (process.env.NODE_ENV === 'development') {
      const mockProducts = generateMockProducts(50, connection.user_id)
      
      // Inserir produtos no Supabase
      const { error } = await supabase
        .from('products')
        .upsert(mockProducts, { onConflict: 'code,user_id' })

      if (error) throw error

      return {
        count: mockProducts.length,
        message: `${mockProducts.length} produtos sincronizados com sucesso`
      }
    }

    // Em produção, fazer chamada real para o ERP
    const productsData = await fetchERPProducts(connection)
    
    if (productsData.length === 0) {
      return {
        count: 0,
        message: 'Nenhum produto encontrado no ERP'
      }
    }

    // Mapear dados do ERP para formato do Supabase
    const mappedProducts = productsData.map((product: any) => 
      mapERPProductToSupabase(product, connection.erp_type, connection.user_id)
    )

    // Inserir/atualizar produtos no Supabase
    const { error } = await supabase
      .from('products')
      .upsert(mappedProducts, { onConflict: 'code,user_id' })

    if (error) throw error

    return {
      count: mappedProducts.length,
      message: `${mappedProducts.length} produtos sincronizados com sucesso`
    }

  } catch (error: any) {
    throw new Error(`Erro ao sincronizar produtos: ${error.message}`)
  }
}

async function syncOrders(connection: any) {
  // Implementação similar para pedidos/orçamentos
  if (process.env.NODE_ENV === 'development') {
    const mockOrders = generateMockOrders(20, connection.user_id)
    
    const { error } = await supabase
      .from('quotes')
      .upsert(mockOrders, { onConflict: 'quote_number,user_id' })

    if (error) throw error

    return {
      count: mockOrders.length,
      message: `${mockOrders.length} pedidos sincronizados com sucesso`
    }
  }

  return { count: 0, message: 'Sincronização de pedidos ainda não implementada' }
}

async function syncCustomers(connection: any) {
  // Implementação para clientes
  if (process.env.NODE_ENV === 'development') {
    return {
      count: 15,
      message: '15 clientes sincronizados com sucesso (simulado)'
    }
  }

  return { count: 0, message: 'Sincronização de clientes ainda não implementada' }
}

async function syncAll(connection: any) {
  try {
    const productsResult = await syncProducts(connection)
    const ordersResult = await syncOrders(connection)
    const customersResult = await syncCustomers(connection)

    const totalCount = productsResult.count + ordersResult.count + customersResult.count

    return {
      count: totalCount,
      message: `Sincronização completa: ${productsResult.count} produtos, ${ordersResult.count} pedidos, ${customersResult.count} clientes`
    }

  } catch (error: any) {
    throw new Error(`Erro na sincronização completa: ${error.message}`)
  }
}

async function fetchERPProducts(connection: any) {
  const headers: any = {
    'Content-Type': 'application/json',
    'User-Agent': 'AutoPanel-ERP-Connector/1.0'
  }

  // Configurar autenticação
  switch (connection.erp_type) {
    case 'totvs_protheus':
      headers['Authorization'] = `Bearer ${connection.api_key}`
      break
    case 'sap_b1':
      headers['Authorization'] = `Basic ${Buffer.from(`${connection.username}:${connection.password}`).toString('base64')}`
      break
    case 'bling':
      headers['Authorization'] = `Bearer ${connection.api_key}`
      break
    // ... outros ERPs
  }

  const endpoint = getProductsEndpoint(connection.erp_type, connection.api_endpoint)
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(30000)
  })

  if (!response.ok) {
    throw new Error(`Erro na API do ERP: ${response.status}`)
  }

  const data = await response.json()
  return data.products || data.items || data
}

function getProductsEndpoint(erpType: string, baseUrl: string): string {
  const endpoints: { [key: string]: string } = {
    'totvs_protheus': '/api/products',
    'sap_b1': '/api/items',
    'senior': '/api/produtos',
    'sankhya': '/api/product',
    'microsiga': '/api/estoque',
    'bling': '/api/produtos',
    'tiny': '/api/produtos.pesquisa',
    'omie': '/api/produtos'
  }

  const endpoint = endpoints[erpType] || '/api/products'
  return `${baseUrl.replace(/\/$/, '')}${endpoint}`
}

function mapERPProductToSupabase(product: any, erpType: string, userId: string) {
  // Mapeamento básico - pode ser customizado por ERP
  return {
    user_id: userId,
    code: product.code || product.codigo || product.item_code || product.id,
    name: product.name || product.nome || product.description || product.desc,
    description: product.description || product.descricao || product.obs || '',
    category: product.category || product.categoria || product.group || 'Geral',
    brand: product.brand || product.marca || product.fabricante || '',
    unit: product.unit || product.unidade || product.um || 'pç',
    stock_quantity: parseInt(product.stock || product.estoque || product.quantity || 0),
    min_stock: parseInt(product.min_stock || product.estoque_min || 5),
    price: parseFloat(product.price || product.preco || product.valor || 0),
    cost: parseFloat(product.cost || product.custo || product.preco_custo || 0),
    supplier: product.supplier || product.fornecedor || '',
    location: product.location || product.localizacao || '',
    status: 'active',
    erp_id: product.id || product.codigo,
    last_sync: new Date().toISOString()
  }
}

function generateMockProducts(count: number, userId: string) {
  const categories = ['Disjuntores', 'Cabos', 'Conectores', 'Painéis', 'Relés', 'Sensores']
  const brands = ['WEG', 'Siemens', 'ABB', 'Schneider', 'GE', 'Legrand']
  const units = ['pç', 'm', 'kg', 'cx']

  const products = []

  for (let i = 1; i <= count; i++) {
    products.push({
      user_id: userId,
      code: `PROD${String(i).padStart(4, '0')}`,
      name: `Produto Elétrico ${i}`,
      description: `Descrição detalhada do produto ${i} para engenharia elétrica`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      unit: units[Math.floor(Math.random() * units.length)],
      stock_quantity: Math.floor(Math.random() * 1000) + 10,
      min_stock: Math.floor(Math.random() * 50) + 5,
      price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      cost: parseFloat((Math.random() * 300 + 5).toFixed(2)),
      supplier: `Fornecedor ${Math.floor(Math.random() * 10) + 1}`,
      location: `Est ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}, Prat ${Math.floor(Math.random() * 10) + 1}`,
      status: 'active',
      erp_id: `ERP_${i}`,
      last_sync: new Date().toISOString()
    })
  }

  return products
}

function generateMockOrders(count: number, userId: string) {
  const clients = ['Empresa A Ltda', 'Construtora B', 'Indústria C S/A', 'Elétrica D', 'Engenharia E']
  const statuses = ['draft', 'sent', 'approved', 'rejected']

  const orders = []

  for (let i = 1; i <= count; i++) {
    const totalAmount = parseFloat((Math.random() * 50000 + 1000).toFixed(2))
    orders.push({
      user_id: userId,
      quote_number: `ORC${String(i).padStart(4, '0')}`,
      client_name: clients[Math.floor(Math.random() * clients.length)],
      client_email: `contato${i}@empresa.com`,
      client_phone: `(11) 9999-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      total_amount: totalAmount,
      final_amount: totalAmount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toDateString(),
      erp_id: `ERP_ORD_${i}`,
      last_sync: new Date().toISOString()
    })
  }

  return orders
}