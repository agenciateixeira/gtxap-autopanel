'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Zap, Shield, Users, BarChart3, Loader2 } from 'lucide-react'
import { auth, supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

// Componente que usa useSearchParams - deve estar dentro de Suspense
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    cnpj: '',
    phone: ''
  })

  // Verificar se usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log('Usuário já logado, redirecionando...')
          router.push(redirectTo)
          return
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkUser()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('Usuário logou, redirecionando...')
          router.push(redirectTo)
        }
        setCheckingAuth(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectTo])

  // Tela de carregamento enquanto verifica autenticação
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Validações
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateCNPJ = (cnpj) => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return cnpjRegex.test(cnpj)
  }

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Nome é obrigatório'
      if (!formData.company) newErrors.company = 'Empresa é obrigatória'
      if (!formData.phone) newErrors.phone = 'Telefone é obrigatório'
      
      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório'
      } else if (!validateCNPJ(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cnpj') {
      formattedValue = formatCNPJ(value)
    } else if (field === 'phone') {
      formattedValue = formatPhone(value)
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLogin) {
        // Login
        console.log('Tentando fazer login...')
        const { data, error } = await auth.signIn(formData.email, formData.password)
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (data?.user) {
          console.log('Login bem-sucedido:', data.user.email)
          toast.success('Login realizado com sucesso!')
          // O redirecionamento será feito pelo listener onAuthStateChange
        }
      } else {
        // Cadastro
        const userData = {
          name: formData.name,
          company: formData.company,
          cnpj: formData.cnpj,
          phone: formData.phone
        }
        
        const { data, error } = await auth.signUp(formData.email, formData.password, userData)
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (data?.user) {
          // Cadastro bem-sucedido
          toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.')          
          // Limpar formulário e voltar para login
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            company: '',
            cnpj: '',
            phone: ''
          })
          setIsLogin(true)
        }
      }
    } catch (error) {
      console.error('Erro de autenticação:', error)
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro inesperado. Tente novamente.'
      
      if (error.message) {
        // Traduzir mensagens de erro comuns do Supabase
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'Email ou senha incorretos'
            break
          case 'User already registered':
            errorMessage = 'Este email já está cadastrado'
            break
          case 'Password should be at least 6 characters':
            errorMessage = 'A senha deve ter pelo menos 6 caracteres'
            break
          case 'Unable to validate email address: invalid format':
            errorMessage = 'Formato de email inválido'
            break
          case 'Signup is disabled':
            errorMessage = 'Cadastro temporariamente desabilitado'
            break
          case 'Email not confirmed':
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada'
            break
          default:
            errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      cnpj: '',
      phone: ''
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%)] bg-[length:60px_60px] opacity-30"></div>
      
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          
          {/* Header */}
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar ao início
            </Link>
            
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">AutoPanel</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {isLogin 
                ? 'Acesse sua plataforma de IA para engenharia elétrica e otimize suas vendas' 
                : 'Comece a revolucionar suas vendas com inteligência artificial integrada'
              }
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1.5 mb-8 border border-gray-700">
            <button
              onClick={toggleMode}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={toggleMode}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campos de Cadastro */}
            {!isLogin && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                        errors.company ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                      }`}
                      placeholder="Nome da empresa"
                    />
                    {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                        errors.cnpj ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                      }`}
                      placeholder="00.000.000/0001-00"
                      maxLength={18}
                    />
                    {errors.cnpj && <p className="text-red-400 text-sm mt-1">{errors.cnpj}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                    }`}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Email Empresarial
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                }`}
                placeholder="seu@empresa.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pr-12 ${
                    errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                  }`}
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pr-12 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-600 focus:ring-orange-500/50 focus:border-orange-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-orange-600/25 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                isLogin ? 'Entrar na Plataforma' : 'Criar Conta Agora'
              )}
            </button>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center">
                <Link href="#" className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                  Esqueceu sua senha?
                </Link>
              </div>
            )}
          </form>

          {/* Login de teste - Remover em produção */}
          {process.env.NODE_ENV === 'development' && isLogin && (
            <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">O crescimento que a sua empresa merece!</p>
              <p className="text-xs text-gray-300">Crie uma conta ou use suas credenciais</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Benefits */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border-l border-gray-700/50">
        <div className="max-w-lg px-12">
          <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Por que escolher AutoPanel?
          </h3>
          <p className="text-gray-300 mb-12 text-lg">
            A solução completa para empresas de engenharia elétrica que querem escalar suas vendas.
          </p>
          
          <div className="space-y-8">
            {[
              {
                icon: Shield,
                title: "Segurança Empresarial",
                description: "Dados criptografados, backup automático e conformidade total com LGPD para máxima proteção."
              },
              {
                icon: BarChart3,
                title: "Integração Total com ERP",
                description: "Conecte qualquer sistema ERP e tenha seus dados sincronizados em tempo real, sem complicações."
              },
              {
                icon: Users,
                title: "IA Especializada",
                description: "Chat inteligente treinado especificamente para componentes elétricos e necessidades do seu setor."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-6 group">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-orange-600/30 transition-all duration-300 group-hover:scale-110">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-2">{benefit.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-orange-600/10 to-orange-700/10 rounded-xl border border-orange-600/20">
            <p className="text-orange-300 font-medium text-center">
              +500 empresas já otimizaram suas vendas com AutoPanel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de loading para o Suspense
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-400">Carregando página de login...</p>
      </div>
    </div>
  )
}

// Componente principal com Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}