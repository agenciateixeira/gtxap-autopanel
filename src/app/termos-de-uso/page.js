'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowLeft,
  FileText,
  Users,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Ban,
  Scale,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Menu,
  X,
  Award,
  Lock
} from 'lucide-react';

export default function TermsOfUsePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('introducao');

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
    { id: 'introducao', title: 'Introdução', icon: <FileText className="w-4 h-4" /> },
    { id: 'definicoes', title: 'Definições', icon: <Users className="w-4 h-4" /> },
    { id: 'aceitacao', title: 'Aceitação', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'servicos', title: 'Serviços', icon: <Settings className="w-4 h-4" /> },
    { id: 'responsabilidades', title: 'Responsabilidades', icon: <Shield className="w-4 h-4" /> },
    { id: 'pagamento', title: 'Pagamento', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'propriedade', title: 'Propriedade Intelectual', icon: <Lock className="w-4 h-4" /> },
    { id: 'limitacoes', title: 'Limitações', icon: <Ban className="w-4 h-4" /> },
    { id: 'rescisao', title: 'Rescisão', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'lei-aplicavel', title: 'Lei Aplicável', icon: <Scale className="w-4 h-4" /> },
    { id: 'contato', title: 'Contato', icon: <Mail className="w-4 h-4" /> }
  ];

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
                <span>Termos de Uso</span>
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
            <Scale className="w-4 h-4" />
            Termos e Condições Legais
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Termos de <span className="text-orange-400">Uso</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Estes termos regulam o uso de nossos serviços de inteligência artificial para engenharia elétrica. 
            Leia atentamente antes de utilizar nossa plataforma.
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
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <div className="prose prose-lg max-w-none">
              {/* Introdução */}
              <section id="introducao" data-section="introducao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">1. Introdução</h2>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Acordo Legal Vinculativo</h4>
                      <p className="text-blue-800 text-sm m-0">
                        Estes Termos de Uso constituem um acordo legal entre você e a AutoPanel Engenharia LTDA, 
                        estabelecendo as condições para utilização de nossos serviços de IA para engenharia elétrica.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Bem-vindo aos serviços da <strong>AutoPanel Engenharia LTDA</strong>, empresa brasileira 
                  com sede em Campinas, São Paulo, especializada em soluções de inteligência artificial 
                  para o setor de engenharia elétrica e processos industriais.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Ao acessar ou utilizar qualquer um de nossos serviços, incluindo nossa plataforma web, 
                  APIs, ferramentas de IA e sistemas integrados, você concorda em cumprir e ficar 
                  vinculado a estes Termos de Uso.
                </p>
              </section>

              {/* Definições */}
              <section id="definicoes" data-section="definicoes" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">2. Definições</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">"AutoPanel" ou "Empresa"</h4>
                    <p className="text-gray-700 text-sm">
                      Refere-se à AutoPanel Engenharia LTDA, CNPJ 00.000.000/0001-00, 
                      com sede em Campinas, São Paulo, Brasil.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">"Usuário" ou "Cliente"</h4>
                    <p className="text-gray-700 text-sm">
                      Qualquer pessoa física ou jurídica que acesse ou utilize nossos serviços, 
                      seja através de conta gratuita ou planos pagos.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">"Serviços"</h4>
                    <p className="text-gray-700 text-sm">
                      Todas as soluções oferecidas pela AutoPanel, incluindo: controle de estoque inteligente, 
                      processos industriais com IA, orçamentista inteligente, atendimento automatizado e APIs.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">"Plataforma"</h4>
                    <p className="text-gray-700 text-sm">
                      O conjunto de aplicações web, mobile, APIs e sistemas que compõem 
                      a infraestrutura tecnológica da AutoPanel.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">"Dados do Usuário"</h4>
                    <p className="text-gray-700 text-sm">
                      Informações fornecidas pelo usuário, incluindo dados pessoais, técnicos, 
                      projetos, especificações e qualquer conteúdo enviado através da Plataforma.
                    </p>
                  </div>
                </div>
              </section>

              {/* Aceitação */}
              <section id="aceitacao" data-section="aceitacao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">3. Aceitação dos Termos</h2>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Leitura Obrigatória</h4>
                      <p className="text-yellow-800 text-sm m-0">
                        É fundamental que você leia, compreenda e concorde com todos os termos antes de 
                        utilizar nossos serviços. Se não concordar com algum aspecto, não utilize a Plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Formas de Aceitação:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Criação de Conta:</strong> Ao se registrar em nossa Plataforma</li>
                  <li>• <strong>Uso dos Serviços:</strong> Ao acessar qualquer funcionalidade</li>
                  <li>• <strong>Assinatura Digital:</strong> Ao contratar planos pagos</li>
                  <li>• <strong>Aceitação Expressa:</strong> Ao marcar "Aceito os Termos"</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-green-900 mb-3">Capacidade Legal</h4>
                  <p className="text-green-800 text-sm">
                    Para utilizar nossos serviços, você deve: (1) ter pelo menos 18 anos de idade; 
                    (2) possuir capacidade legal para contratar; (3) não estar impedido por lei de 
                    receber nossos serviços; (4) fornecer informações verdadeiras e precisas.
                  </p>
                </div>
              </section>

              {/* Serviços */}
              <section id="servicos" data-section="servicos" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">4. Descrição dos Serviços</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Controle de Estoque Inteligente</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      IA que prevê demanda, otimiza níveis de estoque e reduz custos operacionais.
                    </p>
                    <div className="text-xs text-orange-600">✓ Análise preditiva ✓ Otimização automática</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Orçamentista Inteligente</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Geração automática de orçamentos precisos para componentes elétricos.
                    </p>
                    <div className="text-xs text-orange-600">✓ Precisão 99.8% ✓ Resposta em segundos</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Processos Industriais IA</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Otimização completa da cadeia produtiva com análise preditiva.
                    </p>
                    <div className="text-xs text-orange-600">✓ Eficiência +40% ✓ Análise em tempo real</div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Atendimento Automatizado</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Chatbots inteligentes com precisão humana, disponíveis 24/7.
                    </p>
                    <div className="text-xs text-orange-600">✓ Disponibilidade 24/7 ✓ Resposta instantânea</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Disponibilidade e Modificações</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Nos esforçamos para manter nossos serviços disponíveis 24/7, mas pode haver 
                    interrupções para manutenção programada ou atualizações. Reservamo-nos o direito 
                    de modificar, suspender ou descontinuar qualquer serviço com aviso prévio.
                  </p>
                  <p className="text-blue-700 text-sm font-medium">
                    Uptime garantido: 99.9% • SLA disponível para planos empresariais
                  </p>
                </div>
              </section>

              {/* Responsabilidades */}
              <section id="responsabilidades" data-section="responsabilidades" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">5. Responsabilidades do Usuário</h2>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Uso Adequado:</h4>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li>• Utilizar os serviços apenas para fins legítimos e legais</li>
                  <li>• Não interferir no funcionamento da Plataforma</li>
                  <li>• Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>• Fornecer informações precisas e atualizadas</li>
                  <li>• Respeitar os direitos de propriedade intelectual</li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-red-900 mb-3">Atividades Proibidas:</h4>
                  <ul className="text-red-800 text-sm space-y-1 m-0">
                    <li>• Usar a Plataforma para atividades ilegais ou fraudulentas</li>
                    <li>• Tentar hackear, quebrar ou contornar medidas de segurança</li>
                    <li>• Fazer engenharia reversa dos algoritmos de IA</li>
                    <li>• Compartilhar credenciais de acesso com terceiros</li>
                    <li>• Enviar vírus, malware ou código malicioso</li>
                    <li>• Sobrecarregar nossos sistemas com solicitações excessivas</li>
                    <li>• Usar dados ou resultados para competir conosco</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Responsabilidade por Dados:</h4>
                  <p className="text-gray-700 text-sm">
                    Você é responsável pela precisão e legalidade de todos os dados que inserir 
                    na Plataforma. Garante que possui os direitos necessários para usar e processar 
                    essas informações através de nossos serviços.
                  </p>
                </div>
              </section>

              {/* Pagamento */}
              <section id="pagamento" data-section="pagamento" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">6. Pagamento e Cobrança</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Plano Gratuito</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• 30 dias de acesso completo</li>
                      <li>• Todas as funcionalidades básicas</li>
                      <li>• Suporte por e-mail</li>
                      <li>• Sem compromisso</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Planos Pagos</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Faturamento mensal ou anual</li>
                      <li>• Preços em Real (BRL)</li>
                      <li>• Pagamento via PIX, boleto ou cartão</li>
                      <li>• Nota fiscal eletrônica</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Condições de Pagamento:</h4>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li>• <strong>Cobrança Antecipada:</strong> Pagamento devido no início de cada período</li>
                  <li>• <strong>Renovação Automática:</strong> Planos renovam automaticamente</li>
                  <li>• <strong>Alteração de Preços:</strong> Com 30 dias de antecedência</li>
                  <li>• <strong>Impostos:</strong> Todos os preços incluem tributos aplicáveis</li>
                  <li>• <strong>Atraso:</strong> Multa de 2% + juros de 1% ao mês</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">Política de Cancelamento:</h4>
                  <p className="text-yellow-800 text-sm mb-3">
                    Você pode cancelar sua assinatura a qualquer momento. O cancelamento será 
                    efetivo no final do período de cobrança atual, e você continuará tendo 
                    acesso aos serviços pagos até essa data.
                  </p>
                  <p className="text-yellow-700 text-sm font-medium">
                    Não oferecemos reembolsos para períodos de cobrança já pagos, 
                    exceto em casos específicos previstos em lei.
                  </p>
                </div>
              </section>

              {/* Propriedade Intelectual */}
              <section id="propriedade" data-section="propriedade" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">7. Propriedade Intelectual</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Propriedade da AutoPanel:</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Todos os direitos, títulos e interesses na Plataforma, incluindo algoritmos de IA, 
                    código-fonte, design, marca AutoPanel, e toda a propriedade intelectual relacionada, 
                    são e permanecerão propriedade exclusiva da AutoPanel.
                  </p>
                  <p className="text-blue-700 text-sm font-medium">
                    Você recebe apenas uma licença limitada e revogável para usar nossos serviços.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-green-900 mb-3">Seus Dados e Resultados:</h4>
                  <p className="text-green-800 text-sm mb-3">
                    Você mantém a propriedade de todos os dados que insere na Plataforma. 
                    Os resultados gerados por nossa IA com base em seus dados pertencem a você, 
                    mas nos concede direito de uso para melhorar nossos algoritmos.
                  </p>
                  <p className="text-green-700 text-sm font-medium">
                    Garantimos que seus dados proprietários não serão compartilhados com terceiros.
                  </p>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Licença de Uso Concedida:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Não exclusiva:</strong> Outros usuários também podem usar a Plataforma</li>
                  <li>• <strong>Não transferível:</strong> Não pode ser vendida ou cedida a terceiros</li>
                  <li>• <strong>Revogável:</strong> Pode ser cancelada por violação dos termos</li>
                  <li>• <strong>Limitada ao uso comercial:</strong> Apenas para suas atividades empresariais</li>
                </ul>
              </section>

              {/* Limitações */}
              <section id="limitacoes" data-section="limitacoes" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Ban className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">8. Limitações de Responsabilidade</h2>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Limitação Importante</h4>
                      <p className="text-red-800 text-sm m-0">
                        Nossa responsabilidade total por danos, independentemente da causa, 
                        está limitada ao valor pago pelos serviços nos 12 meses anteriores 
                        ao evento que deu origem à reclamação.
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Exclusões de Responsabilidade:</h4>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li>• <strong>Precisão dos Dados:</strong> Não garantimos 100% de precisão em todos os resultados</li>
                  <li>• <strong>Decisões Empresariais:</strong> Você é responsável por suas decisões baseadas em nossos resultados</li>
                  <li>• <strong>Compatibilidade:</strong> Não garantimos compatibilidade com todos os sistemas</li>
                  <li>• <strong>Disponibilidade:</strong> Podem ocorrer interrupções temporárias dos serviços</li>
                  <li>• <strong>Terceiros:</strong> Não somos responsáveis por serviços de terceiros integrados</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">Uso por Sua Conta e Risco:</h4>
                  <p className="text-yellow-800 text-sm">
                    Embora nos esforcemos para fornecer resultados precisos e confiáveis, 
                    você reconhece que utiliza nossos serviços por sua própria conta e risco. 
                    Recomendamos sempre validar resultados críticos com profissionais qualificados.
                  </p>
                </div>
              </section>

              {/* Rescisão */}
              <section id="rescisao" data-section="rescisao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">9. Rescisão</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Rescisão pelo Usuário</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Cancelamento a qualquer momento</li>
                      <li>• Sem penalidades ou taxas</li>
                      <li>• Acesso até o fim do período pago</li>
                      <li>• Download de dados por 30 dias</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Rescisão pela AutoPanel</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• Violação dos termos de uso</li>
                      <li>• Atividades fraudulentas</li>
                      <li>• Não pagamento</li>
                      <li>• Uso inadequado da Plataforma</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Consequências da Rescisão:</h4>
                <ul className="text-gray-700 space-y-2 mb-6">
                  <li>• Acesso imediato aos serviços será suspenso</li>
                  <li>• Dados serão mantidos por 90 dias para recuperação</li>
                  <li>• Obrigações de pagamento permanecem válidas</li>
                  <li>• Cláusulas de confidencialidade continuam vigentes</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Migração de Dados:</h4>
                  <p className="text-green-800 text-sm">
                    Oferecemos ferramentas para exportação de seus dados em formatos padrão. 
                    É sua responsabilidade fazer backup dos dados importantes antes do cancelamento. 
                    Após 90 dias da rescisão, os dados podem ser permanentemente excluídos.
                  </p>
                </div>
              </section>

              {/* Lei Aplicável */}
              <section id="lei-aplicavel" data-section="lei-aplicavel" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">10. Lei Aplicável e Jurisdição</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Legislação Brasileira:</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, 
                    incluindo, mas não limitado ao Código Civil, Código de Defesa do Consumidor, 
                    Lei Geral de Proteção de Dados (LGPD) e Marco Civil da Internet.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Foro Competente:</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Fica eleito o foro da Comarca de <strong>Campinas, Estado de São Paulo</strong>, 
                    com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir 
                    quaisquer questões oriundas destes Termos de Uso.
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Endereço:</strong> Campinas, São Paulo, Brasil • <strong>CEP:</strong> Conforme registros oficiais
                  </p>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">Resolução de Conflitos:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Negociação Direta</h5>
                      <p className="text-gray-700 text-sm">
                        Primeiro, tentaremos resolver qualquer disputa através de negociação direta.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Mediação</h5>
                      <p className="text-gray-700 text-sm">
                        Se necessário, buscaremos mediação através de câmaras especializadas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Arbitragem ou Judicial</h5>
                      <p className="text-gray-700 text-sm">
                        Como último recurso, a questão será submetida ao Poder Judiciário.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contato */}
              <section id="contato" data-section="contato" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">11. Contato Legal</h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Dados da Empresa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Razão Social</h5>
                        <p className="text-gray-700 text-sm">AutoPanel Engenharia LTDA</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">CNPJ</h5>
                        <p className="text-gray-700 text-sm">00.000.000/0001-00</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Inscrição Estadual</h5>
                        <p className="text-gray-700 text-sm">000.000.000.000</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Endereço</h5>
                        <p className="text-gray-700 text-sm">
                          Campinas, São Paulo, Brasil<br />
                          CEP: 00000-000
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Contato Legal</h5>
                        <p className="text-gray-700 text-sm">
                          juridico@autopanelengenharia.com.br<br />
                          +55 (19) 9 9105-9615
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-900 mb-3">Alterações nos Termos</h4>
                  <p className="text-orange-800 text-sm mb-3">
                    Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                    Alterações substanciais serão comunicadas com pelo menos 30 dias de antecedência 
                    através de e-mail e notificação na Plataforma.
                  </p>
                  <p className="text-orange-700 text-sm font-medium">
                    Versão atual: 2.1 • Última atualização: 17 de setembro de 2025
                  </p>
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
              <Link href="/cookies" className="hover:text-orange-400 transition-colors">
                Política de Cookies
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