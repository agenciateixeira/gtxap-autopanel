'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Play,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Bot,
  Target,
  Menu,
  X,
  Star,
  ChevronRight,
  Globe,
  Cpu,
  Award,
  User,
  Sparkles,
  Send
} from 'lucide-react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoMessages = [
    {
      type: 'user',
      text: 'Preciso de um orçamento para 15 disjuntores DIN 16A, 20 contatores tripolar 25A WEG, e 3 motores trifásicos 5CV 1750rpm. Incluir cabos e instalação.',
      delay: 50
    },
    {
      type: 'ai',
      text: 'Analisando especificações técnicas...\n\nORÇAMENTO GERADO EM 2.3s\n\nDISJUNTORES DIN 16A (15 unidades)\n• Schneider iC60N 16A - R$ 2.847,00\n• Inclusos: trilho DIN + acessórios\n\nCONTATORES WEG CWM25 (20 unidades) \n• Tripolar 25A 220V - R$ 4.680,00\n• Bobina CA + contatos auxiliares\n\nMOTORES WEG W22 (3 unidades)\n• 5CV (3,7kW) 1750rpm - R$ 8.940,00\n• Carcaça de ferro fundido IP55\n\nCABOS E INSTALAÇÃO\n• Cabo flexível 4mm² (50m) - R$ 890,00\n• Mão de obra especializada - R$ 1.200,00\n\nTOTAL: R$ 18.557,00\nPrazo: 5-7 dias úteis\nFrete grátis para sua região\n\nOrçamento válido por 15 dias',
      delay: 30
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    const observers = [];
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach((el, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({
                ...prev,
                [index]: true
              }));
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const typeMessage = (message, callback) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    
    const typeInterval = setInterval(() => {
      if (i < message.length) {
        setTypingText(prev => prev + message[i]);
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTimeout(callback, 500);
      }
    }, message.delay || 50);
  };

  const startDemo = () => {
    setShowDemo(true);
    setDemoStep(0);
    setTimeout(() => {
      typeMessage(demoMessages[0], () => {
        setDemoStep(1);
        setTimeout(() => {
          typeMessage(demoMessages[1], () => {
            setDemoStep(2);
          });
        }, 1000);
      });
    }, 500);
  };

  const stats = [
    { number: "500+", label: "Empresas", description: "Confiam em nossas soluções" },
    { number: "10x", label: "Produtividade", description: "Aumento médio dos clientes" },
    { number: "99.8%", label: "Precisão", description: "Taxa de acerto da IA" },
    { number: "2s", label: "Resposta", description: "Tempo médio de processamento" }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: "Controle de Estoque Inteligente",
      description: "IA que prevê demanda e otimiza seu estoque automaticamente",
      benefit: "Reduz custos em 30%"
    },
    {
      icon: <Bot className="w-8 h-8 text-orange-500" />,
      title: "Processos Industriais com IA",
      description: "Otimização completa da cadeia produtiva com análise preditiva",
      benefit: "Aumenta eficiência em 40%"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Orçamentista Inteligente",
      description: "Crie orçamentos precisos em segundos com cálculos automáticos",
      benefit: "10x mais rápido"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Atendimento Automatizado",
      description: "Chatbots inteligentes que atendem 24/7 com precisão humana",
      benefit: "Resposta instantânea"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "Indústria Metalúrgica SP",
      role: "Diretor de Operações",
      content: "A AutoPanel revolucionou nosso controle de estoque. Reduzimos custos em 35% no primeiro mês.",
      rating: 5
    },
    {
      name: "Ana Ferreira",
      company: "Eletrotécnica RJ",
      role: "Gerente de Projetos",
      content: "O orçamentista inteligente acelerou nosso processo comercial em 8x. Incrível!",
      rating: 5
    },
    {
      name: "Roberto Santos",
      company: "Automação Industrial MG",
      role: "CEO",
      content: "Implementação rápida e resultados imediatos. Melhor investimento que fizemos.",
      rating: 5
    }
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
            {/* Menu Esquerdo */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              <Link href="/solucoes" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Soluções
              </Link>
              <Link href="/blog" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Noticias
              </Link>
            </nav>
            
            {/* Logo */}
            <div className="flex-shrink-0 mx-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700' 
                    : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
                }`}>
                  <Zap className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <span className={`text-xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? 'text-gray-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-200'
                }`}>
                  AutoPanel
                </span>
              </Link>
            </div>
            
            {/* Menu Direito */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
              <Link href="/sobre" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Sobre
              </Link>
              <Link href="/contato" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Contato
              </Link>
              <Link href="/login" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Entrar
              </Link>
              <Link href="/contato" className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                isScrolled 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}>
                Começar Agora
              </Link>
            </div>

            {/* Menu Mobile */}
            <button 
              className="lg:hidden"
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
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-6 py-4 space-y-4">
              <Link href="/solucoes" className="block text-gray-600 font-medium">Soluções</Link>
              <Link href="/blog" className="block text-gray-600 font-medium">Noticias</Link>
              <Link href="/sobre" className="block text-gray-600 font-medium">Sobre</Link>
              <Link href="/contato" className="block text-gray-600 font-medium">Contato</Link>
              <Link href="/login" className="block text-gray-600 font-medium">Entrar</Link>
              <Link href="/contato" className="block bg-orange-500 text-white px-6 py-2 rounded-lg text-center font-medium">
                Começar Agora
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-0 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Cpu className="w-4 h-4" />
              IA Aplicada à Engenharia Elétrica
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              O futuro da sua
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"> 
                {' '}indústria{' '}
              </span>
              começa aqui
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              IA de próxima geração alimentada por dados de classe mundial.
              <strong className="text-white"> Multiplique sua produtividade em 10x</strong> 
              {' '}com soluções inteligentes para engenharia elétrica.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={startDemo}
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                Ver Demonstração
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                href="/contato" 
                className="group border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                30 dias grátis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Sem compromisso
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Suporte dedicado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white font-medium ml-4">AutoPanel AI - Orçamentista</span>
              </div>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 h-96 overflow-y-auto bg-gray-900">
              <div className="space-y-4 max-w-3xl">
                {/* Mensagem do Usuário */}
                {demoStep >= 0 && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 max-w-xl">
                      <p className="text-white">
                        {demoStep === 0 ? typingText : demoMessages[0].text}
                        {demoStep === 0 && isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resposta da IA */}
                {demoStep >= 1 && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4 max-w-2xl">
                      <div className="text-white whitespace-pre-line">
                        {demoStep === 1 ? typingText : demoMessages[1].text}
                        {demoStep === 1 && isTyping && <span className="animate-pulse">|</span>}
                      </div>
                    </div>
                  </div>
                )}

                {demoStep >= 2 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                      Orçamento gerado com precisão de 99.8% em apenas 2.3 segundos
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  Demonstração interativa • AutoPanel AI
                </p>
                <Link 
                  href="/contato"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  onClick={() => setShowDemo(false)}
                >
                  Começar Agora
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Section Inline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Demonstração Ao Vivo
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Veja a <span className="text-orange-500">IA em Ação</span>
              </h2>
              <p className="text-xl text-gray-600">
                Orçamentos precisos de componentes elétricos em segundos
              </p>
            </div>

            {/* Interface */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header do Terminal */}
              <div className="bg-gray-800 px-6 py-4 flex items-center gap-3 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white font-medium ml-4 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-orange-400" />
                  AutoPanel AI - Orçamentista Inteligente
                </span>
                <div className="ml-auto flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>

              {/* Conversa */}
              <div className="p-8 min-h-[400px] space-y-6">
                {/* Mensagem do Usuário */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm p-4 max-w-2xl">
                    <p className="text-white leading-relaxed">
                      Preciso de um orçamento para <strong>15 disjuntores DIN 16A</strong>, <strong>20 contatores tripolar 25A WEG</strong>, 
                      e <strong>3 motores trifásicos 5CV 1750rpm</strong>. Incluir cabos e instalação para projeto industrial.
                    </p>
                  </div>
                </div>

                {/* Processamento */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl rounded-tl-sm p-4">
                    <div className="flex items-center gap-2 text-orange-400 mb-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm ml-2">Analisando especificações técnicas...</span>
                    </div>
                  </div>
                </div>

                {/* Resposta da IA */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl rounded-tl-sm p-6 max-w-3xl">
                    <div className="flex items-center gap-2 text-green-400 mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">ORÇAMENTO GERADO EM 2.3s</span>
                    </div>
                    
                    <div className="text-white space-y-4">
                      {/* Disjuntores */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-300">DISJUNTORES DIN 16A</h4>
                          <span className="text-sm text-gray-400">(15 unidades)</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">Schneider iC60N 16A • Inclusos: trilho DIN + acessórios</p>
                        <div className="text-right">
                          <span className="text-xl font-bold text-white">R$ 2.847,00</span>
                        </div>
                      </div>

                      {/* Contatores */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-300">CONTATORES WEG CWM25</h4>
                          <span className="text-sm text-gray-400">(20 unidades)</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">Tripolar 25A 220V • Bobina CA + contatos auxiliares</p>
                        <div className="text-right">
                          <span className="text-xl font-bold text-white">R$ 4.680,00</span>
                        </div>
                      </div>

                      {/* Motores */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-300">MOTORES WEG W22</h4>
                          <span className="text-sm text-gray-400">(3 unidades)</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">5CV (3,7kW) 1750rpm • Carcaça ferro fundido IP55</p>
                        <div className="text-right">
                          <span className="text-xl font-bold text-white">R$ 8.940,00</span>
                        </div>
                      </div>

                      {/* Extras */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-300">CABOS E INSTALAÇÃO</h4>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">Cabo flexível 4mm² (50m) + Mão de obra especializada</p>
                        <div className="text-right">
                          <span className="text-xl font-bold text-white">R$ 2.090,00</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4">
                          <div>
                            <div className="text-2xl font-bold text-green-400">R$ 18.557,00</div>
                            <div className="text-sm text-gray-300">
                              Prazo: 5-7 dias úteis • Frete grátis • Válido por 15 dias
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-green-400 font-medium">ECONOMIA</div>
                            <div className="text-lg font-bold text-green-400">R$ 2.340,00</div>
                            <div className="text-xs text-gray-400">vs. concorrência</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center pt-6">
                  <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full p-2">
                    <div className="flex items-center gap-2 text-green-400 text-sm px-4">
                      <CheckCircle className="w-4 h-4" />
                      Orçamento gerado com <strong>99.8% de precisão</strong>
                    </div>
                    <button 
                      onClick={startDemo}
                      className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      Testar Agora
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features da Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Velocidade Extrema</h3>
                <p className="text-gray-600 text-sm">Orçamentos completos em menos de 3 segundos</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Precisão Absoluta</h3>
                <p className="text-gray-600 text-sm">99.8% de acurácia em especificações técnicas</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Economia Garantida</h3>
                <p className="text-gray-600 text-sm">Até 30% de economia vs. métodos tradicionais</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-animate>
                <div className={`transition-all duration-1000 ${isVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="solucoes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Soluções que <span className="text-orange-500">Transformam</span>
            </h2>
            <p className="text-xl text-gray-600">
              Cada ferramenta foi desenvolvida para resolver desafios específicos 
              da engenharia elétrica e processos industriais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group" data-animate>
                <div className={`transition-all duration-700 ${isVisible[index + 4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {feature.benefit}
                      </div>
                      
                      <div className="mt-6">
                        <Link 
                          href="/solucoes"
                          className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors group"
                        >
                          Saber mais
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="casos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O que nossos <span className="text-orange-500">Clientes</span> dizem
            </h2>
            <p className="text-xl text-gray-600">
              Resultados reais de empresas que transformaram seus negócios conosco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl" data-animate>
                <div className={`transition-all duration-700 ${isVisible[index + 8] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-orange-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para <span className="text-orange-200">10x</span> sua Produtividade?
          </h2>
          
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Junte-se a mais de 500 empresas que já transformaram seus processos 
            com nossas soluções de IA. Comece gratuitamente hoje mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={startDemo}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors font-semibold flex items-center justify-center gap-2 shadow-2xl"
            >
              <Play className="w-5 h-5" />
              Ver Demonstração
            </button>
            <Link 
              href="/contato" 
              className="border-2 border-orange-200 text-white px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Falar com Especialista
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-orange-200 text-sm mt-6">
            30 dias grátis • Sem cartão de crédito • Suporte dedicado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Logo e Descrição */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AutoPanel</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transformamos processos industriais com inteligência artificial, 
                aumentando produtividade e reduzindo custos para engenheiros elétricos.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Award className="w-4 h-4 text-orange-400" />
                Certificado ISO 27001 • Segurança Empresarial
              </div>
            </div>
            
            {/* Soluções */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white">Soluções</h3>
              <ul className="space-y-3">
                <li><Link href="/solucoes" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Controle de Estoque</Link></li>
                <li><Link href="/solucoes" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">IA Industrial</Link></li>
                <li><Link href="/solucoes" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Orçamentista</Link></li>
                <li><Link href="/solucoes" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Atendimento</Link></li>
                <li><Link href="/solucoes" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Integração ERP</Link></li>
              </ul>
            </div>
            
            {/* Empresa */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white">Empresa</h3>
              <ul className="space-y-3">
                <li><Link href="/sobre" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Sobre Nós</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Noticias</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Carreiras</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Parceiros</Link></li>
              </ul>
            </div>
            
            {/* Suporte */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white">Suporte</h3>
              <ul className="space-y-3">
                <li><Link href="/contato" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Contato</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Central de Ajuda</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Documentação</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">API</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Status</Link></li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-white">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Receba insights sobre IA e automação industrial
              </p>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção Inferior */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>© 2025 AutoPanel. Todos os direitos reservados.</span>
                <span className="hidden md:block">•</span>
                <span className="hidden md:block">CNPJ: 00.000.000/0001-00</span>
              </div>
              
              {/* Links Legais */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/politica-de-privacidade" className="hover:text-orange-400 transition-colors">
                  Política de Privacidade
                </Link>
                <Link href="/termos-de-uso" className="hover:text-orange-400 transition-colors">
                  Termos de Uso
                </Link>
                <Link href="/cookies" className="hover:text-orange-400 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* Informações Adicionais */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-500">
                <p>AutoPanel Engenharia LTDA • Campinas, São Paulo, Brasil</p>
                <p className="mt-1">contato@autopanelengenharia.com.br • +55 (19) 9 9105-9615</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Todos os sistemas operacionais
                </div>
                <div className="text-xs text-gray-500">
                  Uptime: 99.9%
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}