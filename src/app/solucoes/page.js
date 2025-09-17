'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  BarChart3, 
  Brain, 
  Clock, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight,
  CheckCircle,
  Target,
  Layers,
  Database,
  Bot,
  Calendar,
  Menu,
  X,
  Play,
  Sparkles,
  Cpu,
  Award,
  ChevronRight,
  MousePointer,
  Code,
  Gauge,
  Workflow
} from 'lucide-react';

export default function SolucoesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState({});

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

  const solucoes = [
    {
      id: 'estoque',
      icon: <BarChart3 className="w-12 h-12 text-orange-500" />,
      title: "Controle de Estoque Inteligente",
      description: "Sistema avançado com IA que monitora, prevê e otimiza seu estoque em tempo real",
      features: [
        "Previsão de demanda com IA",
        "Alertas automáticos de reposição",
        "Análise de giro de estoque",
        "Otimização de espaço físico",
        "Dashboard em tempo real",
        "Integração com ERP"
      ],
      beneficios: "Reduz custos em até 30% e elimina rupturas de estoque",
      color: "from-blue-500 to-blue-600",
      demo: {
        title: "Dashboard de Estoque",
        metrics: [
          { label: "Itens em Estoque", value: "2.847", trend: "+12%" },
          { label: "Previsão de Demanda", value: "98.5%", trend: "+5%" },
          { label: "Economia Mensal", value: "R$ 45k", trend: "+28%" }
        ]
      }
    },
    {
      id: 'industrial',
      icon: <Bot className="w-12 h-12 text-orange-500" />,
      title: "IA para Processos Industriais",
      description: "Inteligência artificial aplicada para otimizar toda sua cadeia produtiva",
      features: [
        "Análise preditiva de máquinas",
        "Otimização de processos",
        "Detecção de anomalias",
        "Manutenção preventiva",
        "Monitoramento 24/7",
        "Relatórios automáticos"
      ],
      beneficios: "Aumenta eficiência em até 40% e reduz paradas não planejadas",
      color: "from-green-500 to-green-600",
      demo: {
        title: "Monitor Industrial",
        metrics: [
          { label: "Eficiência", value: "94.2%", trend: "+18%" },
          { label: "Uptime", value: "99.7%", trend: "+3%" },
          { label: "Economia", value: "R$ 89k", trend: "+41%" }
        ]
      }
    },
    {
      id: 'orcamento',
      icon: <Target className="w-12 h-12 text-orange-500" />,
      title: "Orçamentista Inteligente",
      description: "Sistema que acelera a criação de orçamentos com precisão e agilidade",
      features: [
        "Cálculos automáticos de materiais",
        "Base de preços atualizada",
        "Templates personalizáveis",
        "Aprovação digital",
        "Histórico de propostas",
        "Análise de margem"
      ],
      beneficios: "Acelera processo de orçamento em até 10x",
      color: "from-purple-500 to-purple-600",
      demo: {
        title: "Sistema de Orçamentos",
        metrics: [
          { label: "Orçamentos/Dia", value: "127", trend: "+890%" },
          { label: "Precisão", value: "99.8%", trend: "+2%" },
          { label: "Tempo Médio", value: "2.3s", trend: "-95%" }
        ]
      }
    },
    {
      id: 'atendimento',
      icon: <Users className="w-12 h-12 text-orange-500" />,
      title: "Atendimento Automatizado",
      description: "Chatbots e sistemas inteligentes para atendimento 24/7 aos seus clientes",
      features: [
        "Chatbot com IA conversacional",
        "Integração com WhatsApp",
        "Respostas instantâneas",
        "Escalamento para humanos",
        "Análise de sentimento",
        "Métricas de satisfação"
      ],
      beneficios: "Melhora satisfação do cliente e reduz tempo de resposta",
      color: "from-orange-500 to-orange-600",
      demo: {
        title: "Central de Atendimento",
        metrics: [
          { label: "Tickets Resolvidos", value: "1.247", trend: "+340%" },
          { label: "Satisfação", value: "96.8%", trend: "+25%" },
          { label: "Tempo Resposta", value: "0.8s", trend: "-88%" }
        ]
      }
    }
  ];

  const beneficiosGerais = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "Produtividade 10x Maior",
      description: "Automatização inteligente que multiplica sua capacidade produtiva",
      metric: "1000%"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Respostas em 2 Segundos",
      description: "IA com 99,8% de precisão para consultas instantâneas",
      metric: "2.3s"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Segurança Empresarial",
      description: "Dados protegidos com criptografia e backup automático",
      metric: "99.9%"
    },
    {
      icon: <Layers className="w-8 h-8 text-orange-500" />,
      title: "Integração Total",
      description: "Conecta com qualquer ERP ou sistema existente",
      metric: "100%"
    }
  ];

  const processoSteps = [
    {
      number: "01",
      title: "Análise Inicial",
      description: "Nossos especialistas analisam seus processos atuais e identificam oportunidades de melhoria com IA.",
      icon: <Brain className="w-8 h-8 text-white" />,
      duration: "1-2 dias"
    },
    {
      number: "02", 
      title: "Implementação",
      description: "Configuramos e integramos as soluções de IA com seus sistemas existentes, sem interrupção das operações.",
      icon: <Code className="w-8 h-8 text-white" />,
      duration: "3-5 dias"
    },
    {
      number: "03",
      title: "Resultados",
      description: "Acompanhe o aumento da produtividade e a redução de custos através do nosso dashboard em tempo real.",
      icon: <Gauge className="w-8 h-8 text-white" />,
      duration: "Imediato"
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
                isScrolled ? 'text-orange-500' : 'text-orange-300'
              }`}>
                Soluções
              </Link>
              <Link href="/blog" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}>
                Noticias
              </Link>
            </nav>
            
            {/* Logo Centralizada */}
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
              <Link href="/solucoes" className="block text-orange-500 font-medium">Soluções</Link>
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
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Cpu className="w-4 h-4" />
              IA Integrada para Engenharia Elétrica
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Soluções que
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"> 
                {' '}Transformam{' '}
              </span>
              seu Negócio
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Descubra como nossa inteligência artificial pode revolucionar seu controle de estoque, 
              processos industriais e atendimento, <strong className="text-white">aumentando sua produtividade em até 10x.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/contato" 
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                Falar com Especialista
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                Ver Demonstração
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Implementação em 5 dias
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                ROI garantido
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Gerais com Animação */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosGerais.map((beneficio, index) => (
              <div key={index} className="text-center group" data-animate>
                <div className={`transition-all duration-700 delay-${index * 100} ${isVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative mb-6">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {beneficio.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {beneficio.metric}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {beneficio.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {beneficio.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soluções Interativas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossas <span className="text-orange-500">Soluções</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cada solução foi desenvolvida especificamente para resolver os desafios 
                mais complexos da engenharia elétrica e processos industriais.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solucoes.map((solucao, index) => (
              <div 
                key={solucao.id} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-orange-200"
                data-animate
                onMouseEnter={() => setActiveCard(solucao.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`transition-all duration-700 delay-${index * 100} ${isVisible[index + 5] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {solucao.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {solucao.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {solucao.description}
                      </p>
                    </div>
                  </div>

                  {/* Demo Interativo */}
                  {activeCard === solucao.id && (
                    <div className="bg-gray-900 rounded-xl p-6 mb-6 animate-in slide-in-from-top duration-300">
                      <div className="flex items-center gap-2 text-orange-400 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">{solucao.demo.title}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {solucao.demo.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                            <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                            <div className="text-xs text-green-400">{metric.trend}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-orange-500" />
                      Recursos inclusos:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {solucao.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 mb-6">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="text-orange-700 font-medium text-sm">
                        {solucao.beneficios}
                      </p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/contato"
                    className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors group-hover:gap-3"
                  >
                    Solicitar Demonstração
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo Modernizado */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[9] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Como <span className="text-orange-500">Funciona</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Implementação simples e rápida, com resultados visíveis desde o primeiro dia.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-500 to-orange-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {processoSteps.map((step, index) => (
                <div key={index} className="text-center group" data-animate>
                  <div className={`transition-all duration-700 delay-${index * 200} ${isVisible[index + 10] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white border-2 border-orange-200 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
                        {step.number}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                        {step.duration}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para <span className="text-orange-200">Transformar</span> 
            <br />seu Negócio?
          </h2>
          
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Fale com nossos especialistas e descubra como aumentar sua produtividade 
            em até 10x com nossas soluções de IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contato" 
              className="bg-white text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2 shadow-2xl group"
            >
              <Calendar className="w-5 h-5" />
              Agendar Demonstração
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contato" 
              className="border-2 border-orange-200 text-white px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors font-medium flex items-center justify-center gap-2 group"
            >
              Falar com Especialista
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-orange-200 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ROI em 30 dias
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Sem custos de setup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Garantia de resultados
            </div>
          </div>
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