'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Ban
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('introducao');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

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
    { id: 'dados-coletados', title: 'Dados Coletados', icon: <Database className="w-4 h-4" /> },
    { id: 'como-usamos', title: 'Como Usamos', icon: <Settings className="w-4 h-4" /> },
    { id: 'compartilhamento', title: 'Compartilhamento', icon: <Users className="w-4 h-4" /> },
    { id: 'seguranca', title: 'Segurança', icon: <Shield className="w-4 h-4" /> },
    { id: 'seus-direitos', title: 'Seus Direitos', icon: <Eye className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookies', icon: <Settings className="w-4 h-4" /> },
    { id: 'retencao', title: 'Retenção de Dados', icon: <Clock className="w-4 h-4" /> },
    { id: 'transferencia', title: 'Transferência Internacional', icon: <Globe className="w-4 h-4" /> },
    { id: 'menores', title: 'Proteção de Menores', icon: <Shield className="w-4 h-4" /> },
    { id: 'alteracoes', title: 'Alterações', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'contato', title: 'Contato', icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
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
                <span>Política de Privacidade</span>
              </div>
            </div>
            
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

      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Transparência e Proteção de Dados
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Política de <span className="text-orange-400">Privacidade</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Valorizamos sua privacidade e estamos comprometidos em proteger seus dados pessoais. 
            Esta política explica como coletamos, usamos e protegemos suas informações.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Última atualização: 17 de setembro de 2025
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
                <nav className="space-y-2 max-h-96 overflow-y-auto">
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

          <div className="lg:w-3/4">
            <div className="prose prose-lg max-w-none">
              <section id="introducao" data-section="introducao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">1. Introdução</h2>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Compromisso com a Privacidade</h4>
                      <p className="text-blue-800 text-sm m-0">
                        A AutoPanel está comprometida em proteger e respeitar sua privacidade em conformidade 
                        com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Esta Política de Privacidade descreve como a <strong>AutoPanel Engenharia LTDA</strong>, 
                  situada em Campinas, São Paulo, Brasil, coleta, usa, armazena e protege suas informações 
                  pessoais quando você utiliza nossos serviços de inteligência artificial para engenharia elétrica.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Informações da Empresa:</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Razão Social:</strong> AutoPanel Engenharia LTDA</li>
                    <li>• <strong>CNPJ:</strong> 00.000.000/0001-00</li>
                    <li>• <strong>Endereço:</strong> Campinas, São Paulo, Brasil</li>
                    <li>• <strong>E-mail:</strong> privacidade@autopanelengenharia.com.br</li>
                    <li>• <strong>DPO:</strong> dpo@autopanelengenharia.com.br</li>
                  </ul>
                </div>
              </section>

              <section id="dados-coletados" data-section="dados-coletados" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">2. Dados que Coletamos</h2>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Dados Técnicos Sensíveis</h4>
                      <p className="text-yellow-800 text-sm m-0">
                        Coletamos especificações técnicas, projetos e orçamentos apenas para fornecer 
                        nossos serviços. Estes dados são tratados com máxima confidencialidade e 
                        criptografados em nossa base de dados.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Informações Pessoais
                    </h4>
                    <ul className="text-green-800 text-sm space-y-2 m-0">
                      <li>• Nome completo e cargo</li>
                      <li>• Endereço de e-mail</li>
                      <li>• Número de telefone</li>
                      <li>• Empresa e setor de atuação</li>
                      <li>• CNPJ da empresa</li>
                      <li>• CPF (quando necessário)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Dados Técnicos
                    </h4>
                    <ul className="text-blue-800 text-sm space-y-2 m-0">
                      <li>• Especificações de componentes elétricos</li>
                      <li>• Parâmetros de projetos industriais</li>
                      <li>• Histórico de orçamentos</li>
                      <li>• Preferências de configuração</li>
                      <li>• Logs de uso da IA</li>
                      <li>• Métricas de performance</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="como-usamos" data-section="como-usamos" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">3. Como Usamos seus Dados</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-500" />
                      Prestação de Serviços
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Fornecer soluções de IA personalizadas para sua empresa</li>
                      <li>• Gerar orçamentos precisos e atualizados de componentes</li>
                      <li>• Otimizar processos industriais e fluxos de trabalho</li>
                      <li>• Manter e melhorar nossos algoritmos de inteligência artificial</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      Segurança e Conformidade
                    </h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Proteger contra acesso não autorizado e atividades suspeitas</li>
                      <li>• Cumprir obrigações legais e regulamentações aplicáveis</li>
                      <li>• Realizar auditorias de segurança e conformidade</li>
                      <li>• Manter registros para fins de compliance</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="compartilhamento" data-section="compartilhamento" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">4. Compartilhamento de Dados</h2>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Política de Não Compartilhamento</h4>
                      <p className="text-red-800 text-sm m-0">
                        <strong>NÃO vendemos, alugamos ou compartilhamos</strong> seus dados pessoais 
                        ou técnicos com terceiros para fins comerciais, de marketing ou qualquer 
                        outra finalidade não autorizada expressamente por você.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="seguranca" data-section="seguranca" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">5. Segurança dos Dados</h2>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Medidas de Proteção:</h4>
                  <ul className="text-green-800 text-sm space-y-2">
                    <li>• Criptografia AES-256 para dados em repouso</li>
                    <li>• TLS 1.3 para dados em trânsito</li>
                    <li>• Autenticação multifator (MFA) obrigatória</li>
                    <li>• Monitoramento 24/7 de segurança</li>
                    <li>• Testes de penetração regulares</li>
                    <li>• Backup automatizado e criptografado</li>
                  </ul>
                </div>
              </section>

              <section id="seus-direitos" data-section="seus-direitos" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">6. Seus Direitos (LGPD)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      Acesso aos Dados
                    </h5>
                    <p className="text-gray-700 text-sm">
                      Solicitar informações sobre quais dados pessoais temos sobre você.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-500" />
                      Exclusão de Dados
                    </h5>
                    <p className="text-gray-700 text-sm">
                      Solicitar a exclusão completa de seus dados pessoais.
                    </p>
                  </div>
                </div>
              </section>

              <section id="cookies" data-section="cookies" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">7. Cookies e Tecnologias Similares</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies de performance 
                  para melhorar sua experiência de uso.
                </p>
              </section>

              <section id="retencao" data-section="retencao" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">8. Retenção de Dados</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Períodos de Retenção:</h4>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• <strong>Dados de conta ativa:</strong> Mantidos enquanto a conta estiver ativa</li>
                    <li>• <strong>Dados contratuais:</strong> 5 anos após término do contrato</li>
                    <li>• <strong>Dados técnicos:</strong> 3 anos ou conforme contrato</li>
                    <li>• <strong>Conta inativa:</strong> Excluídos após 24 meses de inatividade</li>
                  </ul>
                </div>
              </section>

              <section id="transferencia" data-section="transferencia" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">9. Transferência Internacional</h2>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-2">Dados no Brasil</h4>
                  <p className="text-green-800 text-sm">
                    Todos os dados pessoais são armazenados exclusivamente em servidores 
                    localizados no território brasileiro, garantindo conformidade com a LGPD.
                  </p>
                </div>
              </section>

              <section id="menores" data-section="menores" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">10. Proteção de Menores</h2>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-semibold text-red-900 mb-2">Restrição de Idade</h4>
                  <p className="text-red-800 text-sm">
                    Nossos serviços são destinados exclusivamente a maiores de 18 anos. 
                    Não coletamos conscientemente dados de menores de idade.
                  </p>
                </div>
              </section>

              <section id="alteracoes" data-section="alteracoes" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">11. Alterações nesta Política</h2>
                </div>

                <p className="text-gray-700">
                  Revisamos periodicamente esta Política de Privacidade. Mudanças substanciais 
                  serão comunicadas por e-mail com 30 dias de antecedência.
                </p>
              </section>

              <section id="contato" data-section="contato" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 m-0">12. Entre em Contato</h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Encarregado de Dados (DPO)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">E-mail</p>
                        <p className="text-gray-600 text-sm">dpo@autopanelengenharia.com.br</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Telefone</p>
                        <p className="text-gray-600 text-sm">+55 (19) 3000-0000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">AutoPanel</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <span>© 2025 AutoPanel Engenharia LTDA</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}