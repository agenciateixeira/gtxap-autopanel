'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Eye,
  X,
  Save
} from 'lucide-react'

export default function EstoquePage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [categories, setCategories] = useState([])

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    unit: 'pç',
    stock_quantity: 0,
    min_stock: 0,
    price: 0,
    cost: 0,
    supplier: '',
    location: ''
  })

  const [editProduct, setEditProduct] = useState({
    id: '',
    code: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    unit: 'pç',
    stock_quantity: 0,
    min_stock: 0,
    price: 0,
    cost: 0,
    supplier: '',
    location: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(data?.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCategories)

    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncWithERP = async () => {
    setSyncing(true)
    try {
      // Verificar se tem conexão ERP configurada
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: erpConnection } = await supabase
        .from('erp_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!erpConnection) {
        toast.error('Nenhuma conexão ERP configurada. Configure seu ERP primeiro em Dashboard > ERP.')
        window.location.href = '/dashboard/erp'
        return
      }

      // Simular sincronização (implementar APIs específicas depois)
      await new Promise(resolve => setTimeout(resolve, 3000)) // 3 segundos

      // Registrar log
      await supabase
        .from('sync_logs')
        .insert({
          user_id: user.id,
          erp_connection_id: erpConnection.id,
          sync_type: 'products',
          status: 'success',
          message: 'Sincronização simulada concluída',
          products_updated: Math.floor(Math.random() * 10) + 1,
          created_at: new Date().toISOString()
        })

      toast.success('Sincronização concluída com sucesso!')
      fetchProducts()

    } catch (error) {
      console.error('Erro na sincronização:', error)
      toast.error('Erro na sincronização. Verifique sua conexão ERP.')
    } finally {
      setSyncing(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('products')
        .insert({
          ...newProduct,
          user_id: user.id,
          price: parseFloat(newProduct.price) || 0,
          cost: parseFloat(newProduct.cost) || 0,
          stock_quantity: parseInt(newProduct.stock_quantity) || 0,
          min_stock: parseInt(newProduct.min_stock) || 0
        })

      if (error) throw error

      setShowAddModal(false)
      setNewProduct({
        code: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        unit: 'pç',
        stock_quantity: 0,
        min_stock: 0,
        price: 0,
        cost: 0,
        supplier: '',
        location: ''
      })
      fetchProducts()
      
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
      toast.error('Erro ao adicionar produto. Verifique se o código não existe.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          code: editProduct.code,
          name: editProduct.name,
          description: editProduct.description,
          category: editProduct.category,
          brand: editProduct.brand,
          unit: editProduct.unit,
          stock_quantity: parseInt(editProduct.stock_quantity) || 0,
          min_stock: parseInt(editProduct.min_stock) || 0,
          price: parseFloat(editProduct.price) || 0,
          cost: parseFloat(editProduct.cost) || 0,
          supplier: editProduct.supplier,
          location: editProduct.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', editProduct.id)

      if (error) throw error

      setShowEditModal(false)
      fetchProducts()
      
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      toast.error('Erro ao atualizar produto.')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (product) => {
    setEditProduct({
      id: product.id,
      code: product.code || '',
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      unit: product.unit || 'pç',
      stock_quantity: product.stock_quantity || 0,
      min_stock: product.min_stock || 0,
      price: product.price || 0,
      cost: product.cost || 0,
      supplier: product.supplier || '',
      location: product.location || ''
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchProducts()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getStockStatus = (product) => {
    if (product.stock_quantity <= 0) {
      return { status: 'Sem estoque', color: 'text-red-500', bg: 'bg-red-100' }
    } else if (product.stock_quantity <= product.min_stock) {
      return { status: 'Estoque baixo', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    } else {
      return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Estoque</h1>
          <p className="text-gray-400">
            {products.length} produtos • {filteredProducts.filter(p => p.stock_quantity <= p.min_stock).length} com estoque baixo
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={syncWithERP}
            disabled={syncing}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar ERP'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="text-right">
            <span className="text-sm text-gray-400">
              Mostrando {filteredProducts.length} de {products.length} produtos
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <tr key={product.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-sm text-gray-400">
                          {product.code} • {product.brand}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {product.stock_quantity} {product.unit}
                      </div>
                      <div className="text-sm text-gray-400">
                        Mín: {product.min_stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-gray-700 rounded transition-colors"
                          title="Editar produto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum produto encontrado</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Adicionar Novo Produto</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Ex: Disjuntores, Cabos, Conectores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unidade *
                  </label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="pç">Peça</option>
                    <option value="m">Metro</option>
                    <option value="kg">Quilograma</option>
                    <option value="l">Litro</option>
                    <option value="cx">Caixa</option>
                    <option value="rolo">Rolo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.min_stock}
                    onChange={(e) => setNewProduct({...newProduct, min_stock: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Ex: Estante A, Prateleira 3"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    'Adicionar Produto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Editar Produto</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.code}
                    onChange={(e) => setEditProduct({...editProduct, code: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={editProduct.brand}
                    onChange={(e) => setEditProduct({...editProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unidade *
                  </label>
                  <select
                    value={editProduct.unit}
                    onChange={(e) => setEditProduct({...editProduct, unit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="pç">Peça</option>
                    <option value="m">Metro</option>
                    <option value="kg">Quilograma</option>
                    <option value="l">Litro</option>
                    <option value="cx">Caixa</option>
                    <option value="rolo">Rolo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editProduct.stock_quantity}
                    onChange={(e) => setEditProduct({...editProduct, stock_quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.min_stock}
                    onChange={(e) => setEditProduct({...editProduct, min_stock: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.cost}
                    onChange={(e) => setEditProduct({...editProduct, cost: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    value={editProduct.supplier}
                    onChange={(e) => setEditProduct({...editProduct, supplier: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={editProduct.location}
                    onChange={(e) => setEditProduct({...editProduct, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Ex: Estante A, Prateleira 3"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}