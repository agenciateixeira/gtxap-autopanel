'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MessageCircle,
  Headphones,
  Users,
  Menu,
  X,
  Sparkles,
  Shield,
  Award,
  Globe,
  Brain,
  Target,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function ContatoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    solucao: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          empresa: formData.empresa,
          telefone: formData.telefone || null,
          solucao: formData.solucao || null,
          mensagem: formData.mensagem || null,
          created_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          nome: '',
          email: '',
          empresa: '',
          telefone: '',
          solucao: '',
          mensagem: ''
        });
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const solucoes = [
    'Controle de Estoque Inteligente',
    'IA para Processos Industriais', 
    'Orçamentista Inteligente',
    'Atendimento Automatizado',
    'Integração com ERP',
    'Consultoria em IA',
    'Outras soluções'
  ];

  const formasContato = [
    {
      icon: <Phone className="w-6 h-6 text-orange-500" />,
      title: "Telefone",
      info: "+55 (19) 9 9105-9615",
      description: "Seg à Sex, 8h às 18h",
      action: "tel:+5519991059615",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Mail className="w-6 h-6 text-orange-500" />,
      title: "E-mail",
      info: "contato@autopanelengenharia.com.br",
      description: "Resposta em até 2 horas",
      action: "mailto:contato@autopanelengenharia.com.br",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
      title: "WhatsApp",
      info: "+55 (19) 9 9105-9615",
      description: "Atendimento instantâneo",
      action: "https://wa.me/5519991059615?text=Olá! Gostaria de conhecer as soluções de IA da AutoPanel",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-500" />,
      title: "Agendar Reunião",
      info: "Demonstração Online",
      description: "30 minutos grátis",
      action: "#form",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const beneficios = [
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: "Demonstração Personalizada",
      description: "Mostramos as soluções funcionando com dados similares aos seus, para que você veja os resultados na prática."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Consultoria Especializada",
      description: "Nossa equipe de engenheiros e especialistas em IA analisa seus processos e sugere as melhores soluções."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-orange-500" />,
      title: "Implementação Garantida",
      description: "Acompanhamos todo o processo de implementação até você ver os resultados de produtividade que prometemos."
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo leva a implementação?",
      answer: "Entre 2 a 4 semanas, dependendo da complexidade. Começamos com um piloto para mostrar resultados rápidos."
    },
    {
      question: "Preciso parar minhas operações?",
      answer: "Não! Nossa implementação é feita sem interromper suas operações atuais. Trabalhamos em paralelo."
    },
    {
      question: "Como funciona o período de teste?",
      answer: "30 dias gratuitos com suporte completo. Se não ver resultados, não cobra nada."
    },
    {
      question: "Integra com meu ERP atual?",
      answer: "Sim! Temos conectores para os principais ERPs do mercado. Se não tiver o seu, desenvolvemos a integração."
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
              <span className={`font-medium ${
                isScrolled ? 'text-orange-500' : 'text-orange-300'
              }`}>
                Contato
              </span>
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
              <span className="block text-orange-500 font-medium">Contato</span>
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
              <Headphones className="w-4 h-4" />
              Time Comercial Especializado
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Vamos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"> 
                {' '}Conversar{' '}
              </span>
              ?
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Nossa equipe de especialistas está pronta para mostrar como a IA pode 
              transformar seus processos industriais e <strong className="text-white">aumentar sua produtividade em até 10x.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="tel:+5519991059615"
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                <Phone className="w-5 h-5" />
                Ligar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#form"
                className="group border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Calendar className="w-5 h-5" />
                Agendar Demonstração
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Demonstração gratuita
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Consultoria sem compromisso
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Resposta em até 2 horas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formas de Contato Interativas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Entre em <span className="text-orange-500">Contato</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Escolha a forma que preferir para falar conosco. Nossa equipe está sempre pronta para ajudar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {formasContato.map((forma, index) => (
              <a 
                key={index} 
                href={forma.action}
                target={forma.action.startsWith('http') ? '_blank' : '_self'}
                rel={forma.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-200 hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
                data-animate
              >
                <div className={`transition-all duration-700 delay-${index * 100} ${isVisible[index + 1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative mb-6">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        {forma.icon}
                      </div>
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${forma.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center`}>
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {forma.title}
                  </h3>
                  <p className="text-orange-500 font-medium mb-1 text-sm">
                    {forma.info}
                  </p>
                  <p className="text-sm text-gray-600">
                    {forma.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Contato Modernizado */}
      <section id="form" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Lado Esquerdo - Informações */}
            <div data-animate>
              <div className={`transition-all duration-700 ${isVisible[5] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Fale com nosso <span className="text-orange-500">Time Comercial</span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Preencha o formulário ao lado e nossos especialistas entrarão em contato 
                  para uma demonstração personalizada das nossas soluções de IA.
                </p>

                <div className="space-y-8">
                  {beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                        {beneficio.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {beneficio.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {beneficio.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-orange-700 font-medium mb-2">
                        Oferta Especial
                      </p>
                      <p className="text-orange-600 text-sm">
                        Primeiros 30 dias grátis para testar nossas soluções de IA 
                        em seu ambiente real de trabalho.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100" data-animate>
              <div className={`transition-all duration-700 delay-200 ${isVisible[6] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {showSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Recebemos sua solicitação. Nossa equipe entrará em contato 
                      em até 2 horas úteis.
                    </p>
                    <button 
                      onClick={() => setShowSuccess(false)}
                      className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Solicitar Demonstração
                      </h3>
                      <p className="text-gray-600">
                        Preencha os dados abaixo e receba uma proposta personalizada
                      </p>
                    </div>

                    {showError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <span className="font-medium">Erro ao enviar mensagem.</span>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          Tente novamente ou entre em contato pelo telefone.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white placeholder-gray-500 transition-all"
                            placeholder="Seu nome completo"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            E-mail Corporativo *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white placeholder-gray-500 transition-all"
                            placeholder="seu@empresa.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Empresa *
                          </label>
                          <input
                            type="text"
                            name="empresa"
                            value={formData.empresa}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white placeholder-gray-500 transition-all"
                            placeholder="Nome da sua empresa"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Telefone
                          </label>
                          <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white placeholder-gray-500 transition-all"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Solução de Interesse
                        </label>
                        <select
                          name="solucao"
                          value={formData.solucao}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white transition-all"
                        >
                          <option value="">Selecione uma solução</option>
                          {solucoes.map((solucao, index) => (
                            <option key={index} value={solucao}>
                              {solucao}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Mensagem
                        </label>
                        <textarea
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none outline-none text-gray-900 bg-white placeholder-gray-500 transition-all"
                          placeholder="Conte-nos mais sobre seus desafios e como podemos ajudar..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Falar com Especialista
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-sm text-gray-500 text-center">
                        Ao enviar, você concorda que nossa equipe entre em contato. 
                        <br />Seus dados estão seguros conosco.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Modernizado */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[7] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Perguntas <span className="text-orange-500">Frequentes</span>
              </h2>
              <p className="text-xl text-gray-600">
                Esclarecemos as principais dúvidas sobre nossas soluções de IA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="group" data-animate>
                <div className={`bg-gray-50 p-6 rounded-xl hover:bg-orange-50 transition-all duration-300 border-2 border-transparent hover:border-orange-200 transition-all duration-700 delay-${index * 100} ${isVisible[index + 8] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate>
            <div className={`transition-all duration-700 delay-400 ${isVisible[12] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link 
                href="/solucoes"
                className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors group"
              >
                Ver todas as soluções em detalhes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
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
            Pronto para <span className="text-orange-200">10x</span> 
            <br />sua Produtividade?
          </h2>
          
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Mais de 500 empresas já aumentaram sua eficiência com nossas soluções de IA. 
            Seja a próxima!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+5519991059615"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2 shadow-2xl group"
            >
              <Phone className="w-5 h-5" />
              Ligar Agora: (19) 9 9105-9615
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="https://wa.me/5519991059615?text=Olá! Gostaria de conhecer as soluções de IA da AutoPanel"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-orange-200 text-white px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors font-medium flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-orange-200 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              30 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Suporte dedicado
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