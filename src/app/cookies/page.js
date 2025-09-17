'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowLeft,
  Settings,
  Cookie,
  BarChart3,
  Shield,
  Eye,
  Smartphone,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Menu,
  Calendar,
  FileText,
  Users,
  Mail,
  Trash2,
  Download,
  ToggleLeft,
  ToggleRight,
  Monitor,
  Target,
  Wrench,
  Database,
  Info,
  Save,
  Phone  // ← Adicionado
} from 'lucide-react';

export default function CookiePolicyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('introducao');
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Sempre habilitado
    analytics: true,
    functional: true,
    marketing: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Detectar seção ativa
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.getAttribute('data-section'));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'introducao', title: 'Introdução', icon: <Cookie className="w-4 h-4" /> },
    { id: 'o-que-sao', title: 'O que são Cookies', icon: <FileText className="w-4 h-4" /> },
    { id: 'tipos-cookies', title: 'Tipos de Cookies', icon: <Settings className="w-4 h-4" /> },
    { id: 'como-usamos', title: 'Como Usamos', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'cookies-terceiros', title: 'Cookies de Terceiros', icon: <Users className="w-4 h-4" /> },
    { id: 'gerenciar', title: 'Gerenciar Cookies', icon: <Settings className="w-4 h-4" /> },
    { id: 'seus-direitos', title: 'Seus Direitos', icon: <Eye className="w-4 h-4" /> },
    { id: 'contato', title: 'Contato', icon: <Mail className="w-4 h-4" /> }
  ];

  const togglePreference = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // Simular salvamento das preferências
    alert('Preferências de cookies salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}>
                  <Zap className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <span className={`text-xl font-bold tracking-tight transition-colors ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  AutoPanel
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span>/</span>
                <span>Política de Cookies</span>
              </div>
            </div>
            
            {/* Voltar */}
            <Link 
              href="/"
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Link>

            {/* Menu Mobile */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-6 py-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Site
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cookie className="w-4 h-4" />
            Transparência e Controle
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Política de <span className="text-orange-400">Cookies</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Entenda como utilizamos cookies e tecnologias similares para melhorar sua experiência 
            em nossa plataforma e como você pode controlar essas preferências.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Última atualização: 17 de setembro de 2025
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Cookie Manager */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-6">
                <h3 className="font-semibold text-orange-900 mb-4">Controle Rápido</h3>
                <button
                  onClick={savePreferences}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
                >
                  <Settings className="w-4 h-4" />
                  Gerenciar Cookies
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <div className="prose prose-lg max-w-none">
              {/* Introdução */}
              <section id="introducao" data-section="introducao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">1. Introdução</h2>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Sobre esta Política</h4>
                      <p className="text-blue-800 text-sm m-0">
                        Esta Política de Cookies explica como a AutoPanel utiliza cookies e tecnologias similares 
                        quando você visita nosso site ou utiliza nossos serviços de IA para engenharia elétrica.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Os cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita um site. 
                  Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, 
                  bem como para fornecer informações aos proprietários do site.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Utilizamos cookies para melhorar sua experiência, personalizar conteúdo, analisar o tráfego do site 
                  e entender de onde nossos visitantes vêm. Esta política fornece informações detalhadas sobre 
                  como e quando usamos essas tecnologias.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-green-900 mb-3">Seu Controle:</h4>
                  <p className="text-green-800 text-sm">
                    Você tem controle total sobre os cookies não essenciais. Pode aceitar todos, recusar todos 
                    ou personalizar suas preferências. Suas escolhas são respeitadas e podem ser alteradas a qualquer momento.
                  </p>
                </div>
              </section>

              {/* O que são Cookies */}
              <section id="o-que-sao" data-section="o-que-sao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">2. O que são Cookies</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Cookies são pequenos fragmentos de dados armazenados pelo seu navegador quando você visita um site. 
                  Eles contêm informações sobre sua visita que podem ser úteis para melhorar sua experiência.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-orange-500" />
                      Cookies Próprios
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Definidos diretamente pela AutoPanel no seu navegador quando você visita nosso site.
                    </p>
                    <div className="text-xs text-gray-600">
                      • Controle total pela AutoPanel<br/>
                      • Usados para funcionalidades essenciais<br/>
                      • Dados processados internamente
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-orange-500" />
                      Cookies de Terceiros
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Definidos por parceiros como Google Analytics, provedores de chat e outras integrações.
                    </p>
                    <div className="text-xs text-gray-600">
                      • Gerenciados por terceiros<br/>
                      • Sujeitos às suas políticas<br/>
                      • Utilizados para analytics e funcionalidades
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Características dos Cookies:</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900">Duração</h5>
                      <p className="text-gray-700 text-sm">
                        <strong>Sessão:</strong> Expiram quando você fecha o navegador<br/>
                        <strong>Persistentes:</strong> Permanecem por um período determinado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900">Armazenamento</h5>
                      <p className="text-gray-700 text-sm">
                        Armazenados localmente no seu dispositivo, não em nossos servidores. 
                        Você pode visualizá-los e excluí-los através das configurações do navegador.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900">Segurança</h5>
                      <p className="text-gray-700 text-sm">
                        Os cookies em si não podem executar programas ou transmitir vírus. 
                        São dados de texto simples que não podem acessar seu disco rígido.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tipos de Cookies */}
              <section id="tipos-cookies" data-section="tipos-cookies" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">3. Tipos de Cookies que Utilizamos</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-2">Cookies Estritamente Necessários</h4>
                        <p className="text-red-800 text-sm mb-3">
                          Essenciais para o funcionamento do site. Sem estes cookies, 
                          partes do nosso site não funcionariam. <strong>Não podem ser desabilitados.</strong>
                        </p>
                        <div className="bg-red-100 rounded-lg p-3">
                          <h5 className="font-medium text-red-900 mb-2">Utilizados para:</h5>
                          <ul className="text-red-800 text-sm space-y-1">
                            <li>• Autenticação e login de usuário</li>
                            <li>• Manter você conectado durante a sessão</li>
                            <li>• Lembrar itens no seu carrinho</li>
                            <li>• Configurações de segurança</li>
                            <li>• Balanceamento de carga do servidor</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Cookies de Performance/Analytics</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          Coletam informações sobre como você usa nosso site, 
                          ajudando-nos a melhorar a performance e experiência do usuário.
                        </p>
                        <div className="bg-blue-100 rounded-lg p-3">
                          <h5 className="font-medium text-blue-900 mb-2">Utilizados para:</h5>
                          <ul className="text-blue-800 text-sm space-y-1">
                            <li>• Contar visitantes e medir tráfego</li>
                            <li>• Entender quais páginas são mais populares</li>
                            <li>• Detectar problemas de navegação</li>
                            <li>• Medir velocidade de carregamento</li>
                            <li>• Análise de conversões e funis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Wrench className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-2">Cookies de Funcionalidade</h4>
                        <p className="text-green-800 text-sm mb-3">
                          Permitem que o site se lembre de suas escolhas e forneça 
                          funcionalidades aprimoradas e personalizadas.
                        </p>
                        <div className="bg-green-100 rounded-lg p-3">
                          <h5 className="font-medium text-green-900 mb-2">Utilizados para:</h5>
                          <ul className="text-green-800 text-sm space-y-1">
                            <li>• Lembrar suas preferências de idioma</li>
                            <li>• Configurações de interface personalizada</li>
                            <li>• Conteúdo baseado na localização</li>
                            <li>• Histórico de interações com IA</li>
                            <li>• Preferências de notificação</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-900 mb-2">Cookies de Marketing/Publicidade</h4>
                        <p className="text-purple-800 text-sm mb-3">
                          Utilizados para mostrar anúncios mais relevantes e medir 
                          a eficácia de campanhas publicitárias.
                        </p>
                        <div className="bg-purple-100 rounded-lg p-3">
                          <h5 className="font-medium text-purple-900 mb-2">Utilizados para:</h5>
                          <ul className="text-purple-800 text-sm space-y-1">
                            <li>• Personalização de anúncios</li>
                            <li>• Medição de eficácia publicitária</li>
                            <li>• Retargeting e remarketing</li>
                            <li>• Análise de audiência</li>
                            <li>• Integração com redes sociais</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Como Usamos */}
              <section id="como-usamos" data-section="como-usamos" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">4. Como Usamos os Cookies</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Na AutoPanel, utilizamos cookies de forma responsável e transparente, sempre priorizando 
                  sua privacidade e experiência do usuário. Abaixo estão os principais usos:
                </p>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-orange-500" />
                      Funcionalidade da Plataforma
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Manter você conectado durante o uso da plataforma de IA</li>
                      <li>• Salvar suas preferências de configuração e personalização</li>
                      <li>• Lembrar projetos e orçamentos em progresso</li>
                      <li>• Otimizar a experiência baseada no seu histórico de uso</li>
                      <li>• Facilitar navegação entre as diferentes funcionalidades</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      Análise e Melhorias
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Entender quais recursos são mais utilizados</li>
                      <li>• Identificar problemas de usabilidade</li>
                      <li>• Medir performance e tempos de resposta</li>
                      <li>• Analisar padrões de navegação para otimizações</li>
                      <li>• Detectar e resolver bugs ou problemas técnicos</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      Segurança e Proteção
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Detectar atividades suspeitas ou fraudulentas</li>
                      <li>• Implementar medidas de segurança personalizadas</li>
                      <li>• Verificar autenticidade de sessões de usuário</li>
                      <li>• Proteger contra ataques automatizados</li>
                      <li>• Monitorar tentativas de acesso não autorizado</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">Dados Coletados:</h4>
                  <p className="text-yellow-800 text-sm mb-3">
                    Os cookies que utilizamos podem coletar informações como páginas visitadas, 
                    tempo gasto no site, recursos utilizados, configurações preferidas e 
                    informações técnicas do dispositivo.
                  </p>
                  <p className="text-yellow-700 text-sm font-medium">
                    Importante: Nunca coletamos dados pessoais sensíveis através de cookies, 
                    como senhas, dados financeiros ou documentos pessoais.
                  </p>
                </div>
              </section>

              {/* Cookies de Terceiros */}
              <section id="cookies-terceiros" data-section="cookies-terceiros" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">5. Cookies de Terceiros</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Utilizamos serviços de terceiros confiáveis para fornecer funcionalidades específicas. 
                  Estes parceiros podem definir seus próprios cookies, sempre em conformidade com suas 
                  políticas de privacidade.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Ferramenta de análise web que nos ajuda a entender como nosso site é usado.
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>• <strong>Finalidade:</strong> Análise de tráfego, comportamento do usuário</div>
                          <div>• <strong>Retenção:</strong> 26 meses</div>
                          <div>• <strong>Controle:</strong> Pode ser desabilitado</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Intercom / Chat</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Sistema de chat ao vivo para suporte e atendimento ao cliente.
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>• <strong>Finalidade:</strong> Suporte, histórico de conversas</div>
                          <div>• <strong>Retenção:</strong> Conforme necessário para suporte</div>
                          <div>• <strong>Controle:</strong> Gerenciado nas configurações da conta</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Processador de pagamentos para transações seguras.
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>• <strong>Finalidade:</strong> Processamento de pagamentos, prevenção de fraude</div>
                          <div>• <strong>Retenção:</strong> Conforme regulamentações financeiras</div>
                          <div>• <strong>Controle:</strong> Essencial para pagamentos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Google Ads / Facebook Pixel</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Plataformas publicitárias para campanhas de marketing direcionadas.
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>• <strong>Finalidade:</strong> Publicidade personalizada, remarketing</div>
                          <div>• <strong>Retenção:</strong> Conforme políticas das plataformas</div>
                          <div>• <strong>Controle:</strong> Pode ser desabilitado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Controle sobre Terceiros:</h4>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• <strong>Seleção Criteriosa:</strong> Trabalhamos apenas com parceiros confiáveis e certificados</li>
                    <li>• <strong>Contratos de Proteção:</strong> Todos possuem acordos de proteção de dados</li>
                    <li>• <strong>Transparência:</strong> Links diretos para as políticas de privacidade dos parceiros</li>
                    <li>• <strong>Opt-out:</strong> Você pode desabilitar cookies de terceiros não essenciais</li>
                  </ul>
                </div>
              </section>

              {/* Gerenciar Cookies */}
              <section id="gerenciar" data-section="gerenciar" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">6. Como Gerenciar seus Cookies</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Você tem controle total sobre os cookies em nosso site. Oferecemos várias formas 
                  de gerenciar suas preferências, desde controles granulares até configurações do navegador.
                </p>

                {/* Painel de Controle de Cookies */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Central de Preferências de Cookies</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h5 className="font-medium text-gray-900">Cookies Essenciais</h5>
                        <p className="text-sm text-gray-600">Necessários para o funcionamento do site</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sempre Ativo</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h5 className="font-medium text-gray-900">Cookies de Analytics</h5>
                        <p className="text-sm text-gray-600">Nos ajudam a melhorar o site</p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className="flex items-center gap-2"
                      >
                        {cookiePreferences.analytics ? (
                          <ToggleRight className="w-10 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-10 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h5 className="font-medium text-gray-900">Cookies Funcionais</h5>
                        <p className="text-sm text-gray-600">Personalização e preferências</p>
                      </div>
                      <button
                        onClick={() => togglePreference('functional')}
                        className="flex items-center gap-2"
                      >
                        {cookiePreferences.functional ? (
                          <ToggleRight className="w-10 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-10 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h5 className="font-medium text-gray-900">Cookies de Marketing</h5>
                        <p className="text-sm text-gray-600">Publicidade personalizada</p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className="flex items-center gap-2"
                      >
                        {cookiePreferences.marketing ? (
                          <ToggleRight className="w-10 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-10 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={savePreferences}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Preferências
                    </button>
                    <button
                      onClick={() => setCookiePreferences({
                        essential: true,
                        analytics: false,
                        functional: false,
                        marketing: false
                      })}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Rejeitar Todos
                    </button>
                  </div>
                </div>

                {/* Controle pelo Navegador */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Controle pelo Navegador</h4>
                  <p className="text-blue-800 text-sm mb-4">
                    Você também pode gerenciar cookies diretamente nas configurações do seu navegador:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Navegadores Desktop:</h5>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• <strong>Chrome:</strong> Configurações → Privacidade → Cookies</li>
                        <li>• <strong>Firefox:</strong> Preferências → Privacidade → Cookies</li>
                        <li>• <strong>Safari:</strong> Preferências → Privacidade</li>
                        <li>• <strong>Edge:</strong> Configurações → Cookies e permissões</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Dispositivos Móveis:</h5>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• <strong>iOS Safari:</strong> Ajustes → Safari → Privacidade</li>
                        <li>• <strong>Android Chrome:</strong> Menu → Configurações → Site</li>
                        <li>• <strong>Apps móveis:</strong> Configurações do app</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ferramentas Adicionais */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">Ferramentas Adicionais de Privacidade</h4>
                  <ul className="text-yellow-800 text-sm space-y-2">
                    <li>• <strong>Google Analytics Opt-out:</strong> Instale o complemento do Google para bloquear analytics</li>
                    <li>• <strong>Do Not Track:</strong> Ative esta configuração no seu navegador</li>
                    <li>• <strong>Extensões de Privacidade:</strong> Ghostery, uBlock Origin, Privacy Badger</li>
                    <li>• <strong>Navegação Privada:</strong> Use modo incógnito/privado para sessões sem cookies persistentes</li>
                  </ul>
                </div>
              </section>

              {/* Seus Direitos */}
              <section id="seus-direitos" data-section="seus-direitos" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">7. Seus Direitos sobre Cookies</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  De acordo com as leis de proteção de dados, incluindo a LGPD, você possui direitos 
                  específicos em relação ao uso de cookies e tecnologias de rastreamento.
                </p>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Direito ao Consentimento</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Você tem o direito de escolher quais cookies aceitar, com exceção daqueles 
                          estritamente necessários para o funcionamento do site.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">
                            <strong>Como exercer:</strong> Use nossa central de preferências ou 
                            configurações do navegador para personalizar suas escolhas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Direito à Informação</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Você tem o direito de saber quais cookies utilizamos, para que servem 
                          e como pode controlá-los.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">
                            <strong>Como exercer:</strong> Esta política fornece informações completas. 
                            Para dúvidas específicas, entre em contato conosco.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Settings className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Direito à Modificação</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Você pode alterar suas preferências de cookies a qualquer momento, 
                          sem penalidades ou restrições.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">
                            <strong>Como exercer:</strong> Retorne a esta página ou acesse as 
                            configurações da sua conta para modificar preferências.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Direito à Exclusão</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          Você pode excluir todos os cookies existentes e impedir a criação 
                          de novos cookies não essenciais.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">
                            <strong>Como exercer:</strong> Use as ferramentas do navegador ou 
                            nossa central de preferências para excluir e bloquear cookies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-orange-900 mb-3">Importante sobre Funcionalidade</h4>
                  <p className="text-orange-800 text-sm">
                    Embora você possa desabilitar a maioria dos cookies, isso pode afetar a funcionalidade 
                    e experiência do usuário. Cookies essenciais não podem ser desabilitados, pois são 
                    necessários para operações básicas como login e segurança.
                  </p>
                </div>
              </section>

              {/* Contato */}
              <section id="contato" data-section="contato" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">8. Contato e Suporte</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Se você tiver dúvidas sobre nossa política de cookies, precisar de ajuda para 
                  configurar suas preferências ou quiser exercer seus direitos, estamos aqui para ajudar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Suporte sobre Cookies</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900">E-mail Especializado</div>
                          <div className="text-sm text-gray-600">cookies@autopanelengenharia.com.br</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900">Chat Técnico</div>
                          <div className="text-sm text-gray-600">Disponível no site durante horário comercial</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900">Suporte por WhatsApp</div>
                          <div className="text-sm text-gray-600">+55 (19) 9 9105-9615</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Recursos Úteis</h4>
                    <div className="space-y-3">
                      <Link 
                        href="/politica-de-privacidade"
                        className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Política de Privacidade Completa</span>
                      </Link>
                      <Link 
                        href="/termos-de-uso"
                        className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Termos de Uso</span>
                      </Link>
                      <button 
                        onClick={savePreferences}
                        className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Central de Preferências</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Tempo de Resposta</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Solicitações Técnicas</h5>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• <strong>Problemas urgentes:</strong> Até 4 horas</li>
                        <li>• <strong>Configurações:</strong> Até 24 horas</li>
                        <li>• <strong>Dúvidas gerais:</strong> Até 48 horas</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Horários de Atendimento</h5>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• <strong>Segunda a Sexta:</strong> 8h às 18h</li>
                        <li>• <strong>Sábado:</strong> 8h às 12h</li>
                        <li>• <strong>E-mail:</strong> 24h (resposta em horário comercial)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Atualizações desta Política</h4>
                  <p className="text-green-800 text-sm mb-3">
                    Esta Política de Cookies pode ser atualizada periodicamente. Quando isso acontecer, 
                    notificaremos você através de e-mail ou banner no site, destacando as principais mudanças.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Versão atual: 2.1</span>
                    <span className="text-green-600 font-medium">17 de setembro de 2025</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">AutoPanel</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/politica-de-privacidade" className="hover:text-orange-400 transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-de-uso" className="hover:text-orange-400 transition-colors">
                Termos de Uso
              </Link>
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Voltar ao Site
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 AutoPanel Engenharia LTDA. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}