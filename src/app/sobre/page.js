'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight,
  Menu,
  X,
  Users,
  Target,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Lightbulb,
  Award,
  CheckCircle,
  Brain,
  Rocket,
  Star,
  Globe,
  Building,
  Code,
  Cpu,
  Shield,
  Clock
} from 'lucide-react';

export default function SobrePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const valores = [
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: "Inovação",
      description: "Sempre buscamos as tecnologias mais avançadas para resolver problemas complexos da engenharia elétrica."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Compromisso",
      description: "Nossa dedicação em entregar resultados excepcionais é o que nos move todos os dias."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Parceria",
      description: "Trabalhamos lado a lado com nossos clientes para garantir o sucesso de cada projeto."
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Excelência",
      description: "Buscamos a perfeição em cada solução, garantindo qualidade e eficiência máximas."
    }
  ];

  const timeline = [
    {
      year: "2025",
      title: "Fundação da AutoPanel",
      description: "Nascemos da necessidade industrial em otimizar atendimentos, controle de estoque e maximização dos orçamentos.",
      icon: <Rocket className="w-6 h-6 text-white" />
    },
    {
      year: "2025",
      title: "Primeiras Soluções de IA",
      description: "Desenvolvemos nossos primeiros algoritmos de inteligência artificial para engenharia elétrica.",
      icon: <Brain className="w-6 h-6 text-white" />
    },
    {
      year: "2025",
      title: "Impacto 10x",
      description: "Comprovamos o aumento de 10x no atendimento da engenharia, causando impacto positivo no faturamento.",
      icon: <TrendingUp className="w-6 h-6 text-white" />
    },
    {
      year: "Futuro",
      title: "Expansão Nacional",
      description: "Nossa missão é trazer o melhor para todo o setor industrial brasileiro.",
      icon: <Globe className="w-6 h-6 text-white" />
    }
  ];

  const fundadores = [
    {
      nome: "Guilherme Teixeira",
      cargo: "Co-fundador & CEO",
      bio: "CEO e desenvolvedor principal da AutoPanel. Responsável pela criação de toda a plataforma de IA e pela estratégia de crescimento da empresa.",
      especialidades: ["Desenvolvimento Full-Stack", "Inteligência Artificial", "Liderança Estratégica"]
    },
    {
      nome: "Vitor Hugo", 
      cargo: "Co-fundador & Especialista em Engenharia Elétrica",
      bio: "Especialista em engenharia elétrica com vasta experiência industrial. Responsável pela validação técnica das soluções e relacionamento com clientes.",
      especialidades: ["Engenharia Elétrica", "Processos Industriais", "Consultoria Técnica"]
    }
  ];

  const stats = [
    { number: "2025", label: "Ano de Fundação", description: "Estamos apenas começando" },
    { number: "10x", label: "Aumento de Produtividade", description: "Resultado comprovado" },
    { number: "100%", label: "Foco em IA", description: "Tecnologia de ponta" },
    { number: "∞", label: "Potencial de Crescimento", description: "Sem limites" }
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
              <span className={`font-medium ${
                isScrolled ? 'text-orange-500' : 'text-orange-300'
              }`}>
                Sobre
              </span>
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
              <span className="block text-orange-500 font-medium">Sobre</span>
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
              <Lightbulb className="w-4 h-4" />
              Nascemos para Transformar a Indústria
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              A
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"> 
                {' '}AutoPanel{' '}
              </span>
              <br />Engenharia
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Nascemos da necessidade industrial em otimizar atendimentos, controle de estoque e maximização dos orçamentos, 
              trazendo um <strong className="text-white">aumento significativo de 10x no atendimento</strong> da engenharia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="#timeline" 
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                Conheça Nossa História
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link 
                href="/solucoes" 
                className="group border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Nossas Soluções
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                Campinas, São Paulo
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                Fundada em 2025
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group" data-animate>
                <div className={`transition-all duration-1000 delay-${index * 100} ${isVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
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

      {/* Nossa História */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16" data-animate>
              <div className={`transition-all duration-700 ${isVisible[4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Nossa <span className="text-orange-500">História</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Uma jornada que começou com uma ideia simples: revolucionar a engenharia elétrica com IA
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none" data-animate>
              <div className={`transition-all duration-700 delay-200 ${isVisible[5] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-orange-500 mb-8">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    A <strong>AutoPanel Engenharia</strong> nasceu em <strong>Campinas, São Paulo</strong>, da visão de dois amigos: 
                    <strong> Vitor Hugo</strong> e <strong>Guilherme Teixeira</strong>. Ambos perceberam uma necessidade crítica 
                    no setor industrial brasileiro - a otimização de processos através da inteligência artificial.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Nossa empresa nasceu da necessidade industrial em <strong>otimizar atendimentos, controle de estoque 
                    e maximização dos orçamentos</strong>. Identificamos que muitas empresas do setor elétrico ainda 
                    operavam com processos manuais e ineficientes, perdendo oportunidades valiosas de crescimento.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Estamos apenas começando nossa jornada em 2025, mas nossa <strong>missão é alta</strong>: queremos 
                    trazer o melhor para todo o setor industrial brasileiro, causando um <strong>impacto positivo 
                    no faturamento</strong> de nossos clientes através da tecnologia de ponta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[6] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossa <span className="text-orange-500">Jornada</span>
              </h2>
              <p className="text-xl text-gray-600">
                Desde a fundação até nossos planos futuros
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Linha da Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-orange-200 via-orange-500 to-orange-200"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`} data-animate>
                  <div className={`transition-all duration-700 delay-${index * 200} ${isVisible[index + 7] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className={`bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200 max-w-sm ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="text-orange-600 font-bold text-lg">{item.year}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Ponto na linha */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fundadores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[11] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossos <span className="text-orange-500">Fundadores</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dois amigos unidos pela paixão em transformar a indústria brasileira através da tecnologia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {fundadores.map((fundador, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group" data-animate>
                <div className={`transition-all duration-700 delay-${index * 200} ${isVisible[index + 12] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <span className="text-white text-2xl font-bold">{fundador.nome.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{fundador.nome}</h3>
                    <p className="text-orange-600 font-medium">{fundador.cargo}</p>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {fundador.bio}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Especialidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {fundador.especialidades.map((especialidade, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          {especialidade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[14] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossos <span className="text-orange-500">Valores</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Os princípios que guiam cada decisão e inovação da AutoPanel
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <div key={index} className="text-center group" data-animate>
                <div className={`transition-all duration-700 delay-${index * 100} ${isVisible[index + 15] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors group-hover:scale-110 transform duration-300">
                    {valor.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {valor.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {valor.description}
                  </p>
                </div>
              </div>
            ))}
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
            Faça Parte da <span className="text-orange-200">Revolução</span> 
            <br />Industrial
          </h2>
          
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Estamos apenas começando nossa jornada. Junte-se a nós para transformar 
            o futuro da engenharia elétrica no Brasil.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contato" 
              className="bg-white text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2 shadow-2xl group"
            >
              Conhecer Nossas Soluções
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contato" 
              className="border-2 border-orange-200 text-white px-8 py-4 rounded-xl hover:bg-orange-400 transition-colors font-medium flex items-center justify-center gap-2 group"
            >
              Falar Conosco
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-orange-200 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Empresa jovem e inovadora
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Foco total em resultados
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Tecnologia de ponta
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