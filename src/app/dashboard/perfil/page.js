// src/app/dashboard/perfil/page.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  MapPin,
  Calendar,
  Shield,
  Key,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function PerfilPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    cnpj: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      setUser(user)

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      if (profileData) {
        setProfile(profileData)
        setFormData({
          name: profileData.name || '',
          company: profileData.company || '',
          cnpj: profileData.cnpj || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          zip_code: profileData.zip_code || ''
        })
      } else {
        // Criar perfil se não existir
        const newProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          company: user.user_metadata?.company || '',
          cnpj: user.user_metadata?.cnpj || '',
          phone: user.user_metadata?.phone || ''
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) throw createError
        
        setProfile(createdProfile)
        setFormData({
          name: createdProfile.name || '',
          company: createdProfile.company || '',
          cnpj: createdProfile.cnpj || '',
          phone: createdProfile.phone || '',
          address: '',
          city: '',
          state: '',
          zip_code: ''
        })
      }

    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          company: formData.company,
          cnpj: formData.cnpj,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...formData })
      setEditing(false)
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })

      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)

    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      company: profile?.company || '',
      cnpj: profile?.cnpj || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zip_code: profile?.zip_code || ''
    })
    setEditing(false)
    setMessage({ type: '', text: '' })
  }

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  const formatZipCode = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cnpj') {
      formattedValue = formatCNPJ(value)
    } else if (field === 'phone') {
      formattedValue = formatPhone(value)
    } else if (field === 'zip_code') {
      formattedValue = formatZipCode(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Perfil do Usuário</h1>
          <p className="text-gray-400">
            Gerencie suas informações pessoais e da empresa
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      {/* Mensagens */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-600/20 border-green-600/30 text-green-300' 
            : 'bg-red-600/20 border-red-600/30 text-red-300'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dados Pessoais */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">Dados Pessoais</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-white p-2">{profile?.name || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="flex items-center text-gray-400 p-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <div className="flex items-center text-white p-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {profile?.phone || 'Não informado'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dados da Empresa */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <Building2 className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">Dados da Empresa</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Razão Social *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="text-white p-2">{profile?.company || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CNPJ
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <div className="flex items-center text-white p-2">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    {profile?.cnpj || 'Não informado'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <MapPin className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">Endereço</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço Completo
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, bairro"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="text-white p-2">{profile?.address || 'Não informado'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-white p-2">{profile?.city || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  {editing ? (
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PR">Paraná</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="GO">Goiás</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="BA">Bahia</option>
                      <option value="PE">Pernambuco</option>
                      <option value="CE">Ceará</option>
                      {/* Adicione outros estados conforme necessário */}
                    </select>
                  ) : (
                    <p className="text-white p-2">{profile?.state || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CEP
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <p className="text-white p-2">{profile?.zip_code || 'Não informado'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Info da Conta */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <Shield className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">Informações da Conta</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Data de Criação</p>
                <div className="flex items-center text-white mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(user?.created_at)}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Último Acesso</p>
                <div className="flex items-center text-white mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(user?.last_sign_in_at)}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Status da Conta</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-green-400 text-sm">Verificado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <Key className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">Segurança</h3>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <div>
                  <p className="text-white font-medium">Alterar Senha</p>
                  <p className="text-sm text-gray-400">Atualizar sua senha de acesso</p>
                </div>
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
                <div>
                  <p className="text-white font-medium">Autenticação 2FA</p>
                  <p className="text-sm text-gray-400">Adicionar camada extra de segurança</p>
                </div>
                <Shield className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}