'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight,
  Menu,
  X,
  Clock,
  User,
  Calendar,
  Tag,
  Share2,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Globe,
  Bot,
  Package,
  MessageCircle,
  Cpu,
  Award,
  Eye,
  Heart,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check
} from 'lucide-react';

export default function BlogPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Fechar modal com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        setSelectedArticle(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Prevenir scroll quando modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const categories = [
    { id: 'todos', name: 'Todos os Artigos', count: 6 },
    { id: 'ia-industrial', name: 'IA Industrial', count: 2 },
    { id: 'atendimento', name: 'Atendimento', count: 2 },
    { id: 'logistica', name: 'Logística', count: 2 }
  ];

  const articles = [
    {
      id: 1,
      title: "A Revolução da IA Industrial em 2025: Como a Automação Inteligente Está Transformando Fábricas",
      excerpt: "Com 67% dos executivos já implementando IA em processos industriais, descubra como a automação inteligente está redefinindo os padrões de produtividade e criando fábricas verdadeiramente inteligentes.",
      content: `
        <p>A inteligência artificial está redefinindo completamente o panorama industrial mundial. Em 2025, testemunhamos uma transformação sem precedentes nas fábricas ao redor do globo, onde sistemas inteligentes não apenas automatizam processos, mas também tomam decisões complexas em tempo real.</p>

        <h2>O Estado Atual da IA Industrial</h2>
        <p>Segundo dados recentes da McKinsey Global Institute, 67% dos executivos industriais já implementaram pelo menos uma solução de IA em seus processos produtivos. Este número representa um crescimento de 340% nos últimos três anos, demonstrando a aceleração exponencial da adoção dessas tecnologias.</p>

        <p>As principais áreas de implementação incluem:</p>
        <ul>
          <li><strong>Manutenção Preditiva:</strong> Redução de 30-50% nos custos de manutenção</li>
          <li><strong>Controle de Qualidade:</strong> Detecção de defeitos com 99.7% de precisão</li>
          <li><strong>Otimização de Processos:</strong> Aumento de 15-25% na eficiência produtiva</li>
          <li><strong>Gestão de Energia:</strong> Redução de 10-20% no consumo energético</li>
        </ul>

        <h2>Tecnologias Emergentes</h2>
        <p>As fábricas inteligentes de 2025 incorporam uma combinação sofisticada de tecnologias:</p>

        <h3>1. Machine Learning Avançado</h3>
        <p>Algoritmos de aprendizado profundo analisam padrões complexos em dados de produção, identificando oportunidades de otimização que seriam impossíveis de detectar por métodos tradicionais. Estes sistemas aprendem continuamente, melhorando sua precisão e eficácia ao longo do tempo.</p>

        <h3>2. Visão Computacional</h3>
        <p>Câmeras inteligentes equipadas com algoritmos de visão computacional inspecionam produtos em velocidades impossíveis para o olho humano, detectando defeitos microscópicos e garantindo padrões de qualidade consistentes.</p>

        <h3>3. Robótica Colaborativa</h3>
        <p>Robôs colaborativos (cobots) trabalham lado a lado com operadores humanos, combinando a precisão mecânica com a flexibilidade e criatividade humana. Esta sinergia está criando ambientes de trabalho mais seguros e produtivos.</p>

        <h2>Casos de Sucesso</h2>
        <p>A implementação da IA industrial já apresenta resultados impressionantes em diversas empresas:</p>

        <p><strong>Siemens (Alemanha):</strong> A fábrica de Amberg utiliza sistemas de IA para monitorar e otimizar todos os aspectos da produção, alcançando uma taxa de defeitos de apenas 0.001% e uma eficiência de produção de 99.9988%.</p>

        <p><strong>General Electric (EUA):</strong> O sistema Predix da GE analisa dados de turbinas industriais em tempo real, prevendo falhas com até 30 dias de antecedência e reduzindo o tempo de inatividade em 20%.</p>

        <h2>Conclusão</h2>
        <p>A revolução da IA industrial não é mais uma promessa futura – é uma realidade presente que está transformando fundamentalmente como produzimos, gerenciamos e otimizamos processos industriais. As empresas que abraçarem essa transformação hoje estarão melhor posicionadas para liderar o mercado de amanhã.</p>
      `,
      category: "ia-industrial",
      author: "Guilherme Teixeira",
      date: "2025-01-15",
      readTime: "8 min",
      views: "2.4k",
      tags: ["IA Industrial", "Automação", "Indústria 4.0"],
      featured: true,
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "IA Preditiva na Indústria: Reduzindo Downtime e Aumentando Eficiência em 40%",
      excerpt: "Explore como sistemas de IA preditiva estão revolucionando a manutenção industrial, permitindo que empresas prevejam falhas antes que aconteçam e otimizem a performance de equipamentos em tempo real.",
      content: `
        <p>A manutenção preditiva baseada em inteligência artificial representa uma das aplicações mais transformadoras da IA na indústria moderna. Esta tecnologia está revolucionando como as empresas gerenciam seus ativos, prevenindo falhas antes que ocorram e otimizando a performance dos equipamentos.</p>

        <h2>O Paradigma da Manutenção Preditiva</h2>
        <p>Tradicionalmente, a manutenção industrial seguia dois modelos principais: manutenção corretiva (após a falha) e manutenção preventiva (em intervalos programados). A IA preditiva introduz um terceiro modelo revolucionário: a manutenção baseada na condição real dos equipamentos.</p>

        <h3>Como Funciona</h3>
        <p>Sensores IoT coletam dados continuamente sobre:</p>
        <ul>
          <li>Vibração e ruído</li>
          <li>Temperatura e pressão</li>
          <li>Consumo de energia</li>
          <li>Análise de óleos e lubrificantes</li>
          <li>Corrente elétrica e tensão</li>
        </ul>

        <h2>Benefícios Comprovados</h2>
        <p>Empresas que implementaram IA preditiva relatam melhorias significativas:</p>
        <ul>
          <li><strong>Redução de 40% no downtime não planejado</strong></li>
          <li><strong>Diminuição de 25% nos custos de manutenção</strong></li>
          <li><strong>Aumento de 20% na vida útil dos equipamentos</strong></li>
          <li><strong>Melhoria de 15% na eficiência operacional</strong></li>
        </ul>

        <h2>Conclusão</h2>
        <p>A IA preditiva está transformando a manutenção industrial de uma função reativa para uma capacidade estratégica proativa. As empresas que adotarem essas tecnologias agora ganharão vantagens competitivas significativas em termos de eficiência, custos e confiabilidade.</p>
      `,
      category: "ia-industrial", 
      author: "Vitor Hugo",
      date: "2025-01-12",
      readTime: "6 min",
      views: "1.8k",
      tags: ["Manutenção Preditiva", "IoT", "Machine Learning"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 3,
      title: "Atendimento ao Cliente com IA: 95% das Interações Serão Automatizadas até 2025",
      excerpt: "Descubra como chatbots inteligentes e agentes de IA estão transformando o atendimento ao cliente, oferecendo respostas instantâneas com 99.8% de precisão e reduzindo custos operacionais em até 30%.",
      content: `
        <p>O atendimento ao cliente está passando por uma revolução impulsionada pela inteligência artificial. Estamos testemunhando uma transformação fundamental na forma como as empresas interagem com seus clientes, com sistemas de IA cada vez mais sofisticados assumindo a maior parte das interações de suporte.</p>

        <h2>A Evolução do Atendimento Automatizado</h2>
        <p>Os chatbots evoluíram drasticamente nos últimos anos. Os sistemas atuais utilizam processamento de linguagem natural (NLP) avançado e aprendizado de máquina para compreender nuances linguísticas, contexto emocional e intenções complexas dos clientes.</p>

        <h3>Principais Avanços Tecnológicos</h3>
        <ul>
          <li><strong>Processamento de Linguagem Natural (NLP):</strong> Compreensão contextual de conversas complexas</li>
          <li><strong>Análise de Sentimentos:</strong> Detecção de emoções e ajuste do tom da resposta</li>
          <li><strong>Aprendizado Contínuo:</strong> Melhoria automática baseada em interações anteriores</li>
          <li><strong>Integração Multicanal:</strong> Suporte consistente em chat, voz, email e redes sociais</li>
        </ul>

        <h2>Impacto nos Resultados Empresariais</h2>
        <p>As empresas que implementaram IA no atendimento ao cliente relatam melhorias significativas:</p>
        <ul>
          <li><strong>Redução de 30% nos custos operacionais</strong></li>
          <li><strong>Aumento de 40% na satisfação do cliente</strong></li>
          <li><strong>Resolução de 80% dos tickets em primeiro contato</strong></li>
          <li><strong>Disponibilidade 24/7 sem custos adicionais</strong></li>
          <li><strong>Tempo de resposta reduzido para menos de 2 segundos</strong></li>
        </ul>

        <h2>Conclusão</h2>
        <p>A automação do atendimento ao cliente com IA não é mais opcional – é uma necessidade competitiva. As empresas que abraçarem essa transformação rapidamente ganharão vantagens significativas em eficiência, custos e satisfação do cliente.</p>
      `,
      category: "atendimento",
      author: "Guilherme Teixeira", 
      date: "2025-01-10",
      readTime: "7 min",
      views: "3.1k",
      tags: ["Chatbots", "Customer Service", "NLP"],
      featured: true,
      image: "/api/placeholder/800/400"
    },
    {
      id: 4,
      title: "O Futuro do Atendimento: IA Emocional e Personalização Hiperpersonalizada",
      excerpt: "Com o mercado de IA emocional projetado para atingir US$ 91,67 bilhões até 2025, veja como a inteligência artificial está aprendendo a detectar emoções e personalizar cada interação com clientes.",
      content: `
        <p>Estamos entrando em uma nova era do atendimento ao cliente, onde a inteligência artificial não apenas compreende as palavras dos clientes, mas também suas emoções, contexto pessoal e necessidades individuais. Esta evolução representa um salto qualitativo na experiência do cliente.</p>

        <h2>O que é IA Emocional?</h2>
        <p>A inteligência artificial emocional (Emotional AI ou Affective Computing) refere-se à capacidade dos sistemas de reconhecer, interpretar, processar e simular emoções humanas. Esta tecnologia utiliza uma combinação de:</p>
        <ul>
          <li><strong>Análise de Sentimentos:</strong> Processamento de texto para identificar emoções</li>
          <li><strong>Reconhecimento Facial:</strong> Detecção de expressões emocionais</li>
          <li><strong>Análise de Voz:</strong> Identificação de tom, ritmo e padrões vocais</li>
          <li><strong>Biometria:</strong> Monitoramento de sinais fisiológicos como batimentos cardíacos</li>
        </ul>

        <h2>Benefícios Mensuráveis</h2>
        <p>Empresas implementando IA emocional reportam:</p>
        <ul>
          <li><strong>Aumento de 45% na satisfação do cliente</strong></li>
          <li><strong>Redução de 60% na taxa de churn</strong></li>
          <li><strong>Melhoria de 35% na resolução em primeiro contato</strong></li>
          <li><strong>Aumento de 25% no valor do tempo de vida do cliente (LTV)</strong></li>
        </ul>

        <h2>Conclusão</h2>
        <p>A IA emocional representa o próximo grande salto na evolução do atendimento ao cliente. Ao compreender e responder às emoções humanas de forma inteligente e respeitosa, podemos criar experiências verdadeiramente excepcionais que fortalecem os relacionamentos entre empresas e clientes.</p>
      `,
      category: "atendimento",
      author: "Vitor Hugo",
      date: "2025-01-08",
      readTime: "9 min", 
      views: "2.7k",
      tags: ["IA Emocional", "Personalização", "CX"],
      featured: false,
      image: "/api/placeholder/600/300"
    },
    {
      id: 5,
      title: "IA na Logística: Como a Automação de Armazéns Está Criando Supply Chains Inteligentes",
      excerpt: "O mercado global de IA em logística atingiu US$ 20,8 bilhões em 2025. Descubra como robôs autônomos, otimização de rotas em tempo real e previsão de demanda estão revolucionando a cadeia de suprimentos.",
      content: `
        <p>A logística moderna está sendo completamente reimaginada pela inteligência artificial. Em 2025, testemunhamos uma transformação sem precedentes na gestão de cadeias de suprimentos, com sistemas inteligentes otimizando cada aspecto das operações logísticas.</p>

        <h2>O Panorama Atual da IA na Logística</h2>
        <p>O mercado global de IA em logística cresceu exponencialmente, atingindo US$ 20,8 bilhões em 2025. Este crescimento é impulsionado pela necessidade urgente de:</p>
        <ul>
          <li>Reduzir custos operacionais em um mercado competitivo</li>
          <li>Melhorar a precisão e velocidade das entregas</li>
          <li>Otimizar o uso de recursos e espaço</li>
          <li>Responder rapidamente às mudanças na demanda</li>
        </ul>

        <h2>Robôs Autônomos em Armazéns</h2>
        <p>A robotização de armazéns representa uma das aplicações mais visíveis da IA na logística:</p>
        <h3>Tipos de Robôs Utilizados</h3>
        <ul>
          <li><strong>AGVs (Automated Guided Vehicles):</strong> Movimentam pallets e cargas pesadas</li>
          <li><strong>AMRs (Autonomous Mobile Robots):</strong> Navegam dinamicamente entre obstáculos</li>
          <li><strong>Robôs de Picking:</strong> Selecionam itens específicos com precisão</li>
          <li><strong>Drones de Inventário:</strong> Realizam contagem automatizada de estoque</li>
        </ul>

        <h2>Benefícios Operacionais</h2>
        <ul>
          <li><strong>Aumento de 300% na produtividade</strong> em operações de picking</li>
          <li><strong>Redução de 99.9% nos erros</strong> de seleção de produtos</li>
          <li><strong>Operação 24/7</strong> sem necessidade de pausas</li>
          <li><strong>ROI de 18-24 meses</strong> na maioria das implementações</li>
        </ul>

        <h2>Conclusão</h2>
        <p>A IA está criando uma nova era na logística, onde eficiência, precisão e adaptabilidade são maximizadas através da automação inteligente. As empresas que abraçarem essas tecnologias agora estarão melhor posicionadas para competir no mercado globalizado do futuro.</p>
      `,
      category: "logistica",
      author: "Guilherme Teixeira",
      date: "2025-01-05",
      readTime: "10 min",
      views: "2.9k", 
      tags: ["Supply Chain", "Robótica", "Otimização"],
      featured: true,
      image: "/api/placeholder/800/400"
    },
    {
      id: 6,
      title: "Armazéns Autônomos: O Futuro da Logística Está Acontecendo Agora",
      excerpt: "Explore como grandes players como Amazon e Walmart estão implementando sistemas de IA que permitem operações de armazém 24/7 completamente autônomas, reduzindo custos e aumentando precisão.",
      content: `
        <p>Os armazéns autônomos representam o ápice da evolução logística, onde sistemas de inteligência artificial orquestram operações complexas sem intervenção humana direta. Esta revolução está acontecendo agora, redefinindo os padrões de eficiência e precisão na gestão de estoques.</p>

        <h2>Definindo Armazéns Autônomos</h2>
        <p>Um armazém autônomo é uma instalação onde sistemas de IA coordenam todas as operações principais:</p>
        <ul>
          <li><strong>Recebimento automatizado</strong> de mercadorias</li>
          <li><strong>Armazenamento inteligente</strong> otimizado por algoritmos</li>
          <li><strong>Picking e packing</strong> realizados por robôs</li>
          <li><strong>Expedição automatizada</strong> com verificação de qualidade</li>
          <li><strong>Manutenção preditiva</strong> de todos os equipamentos</li>
        </ul>

        <h2>Casos de Implementação Real</h2>
        <h3>Amazon: Pioneira em Automação</h3>
        <p>A Amazon opera centros de distribuição com níveis impressionantes de automação:</p>
        <ul>
          <li><strong>520.000+ robôs</strong> em operação global</li>
          <li><strong>75% de redução</strong> no tempo de processamento</li>
          <li><strong>50% de aumento</strong> na capacidade de armazenamento</li>
          <li><strong>99.99% de precisão</strong> em seleção de produtos</li>
        </ul>

        <h2>Benefícios Operacionais</h2>
        <h3>Eficiência Extrema</h3>
        <ul>
          <li><strong>Operação 24/7:</strong> Sem necessidade de pausas ou turnos</li>
          <li><strong>Velocidade constante:</strong> Performance uniforme independente de hora ou dia</li>
          <li><strong>Zero desperdício:</strong> Otimização máxima do espaço disponível</li>
        </ul>

        <h3>Redução de Custos</h3>
        <ul>
          <li><strong>40% de redução</strong> em custos operacionais</li>
          <li><strong>60% menos</strong> necessidade de mão de obra direta</li>
          <li><strong>30% de economia</strong> em consumo energético</li>
        </ul>

        <h2>Conclusão</h2>
        <p>Os armazéns autônomos não são mais ficção científica – são realidade operacional que está redefinindo os padrões de excelência logística. Empresas que investirem nesta transformação agora ganharão vantagens competitivas duradouras.</p>
      `,
      category: "logistica",
      author: "Vitor Hugo", 
      date: "2025-01-03",
      readTime: "8 min",
      views: "2.2k",
      tags: ["Armazéns Autônomos", "AI Robotics", "Walmart"],
      featured: false,
      image: "/api/placeholder/600/300"
    }
  ];

  const openArticle = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const shareArticle = (platform) => {
    if (!selectedArticle) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(selectedArticle.title);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(article => article.featured);

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
      <section className="pt-0 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
              <BookOpen className="w-4 h-4" />
              Insights sobre IA Industrial
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Noticias
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"> 
                {' '}AutoPanel{' '}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Descubra as últimas tendências em <strong className="text-white">inteligência artificial industrial</strong>, 
              automação de processos e inovações que estão transformando o setor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="#artigos" 
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-2xl"
              >
                Explorar Artigos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contato" 
                className="group border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Falar com Especialistas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Artigos atualizados semanalmente
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                Baseado em dados globais de 2025
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                Insights de especialistas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section id="artigos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos por título, conteúdo ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white"
                />
              </div>
            </div>
            
            {/* Categorias */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
                  }`}
                >
                  {category.name}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artigos em Destaque */}
      {featuredArticles.length > 0 && selectedCategory === 'todos' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16" data-animate>
              <div className={`transition-all duration-700 ${isVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Artigos em <span className="text-orange-500">Destaque</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Os conteúdos mais relevantes sobre IA industrial desta semana
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article, index) => (
                <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer" data-animate onClick={() => openArticle(article)}>
                  <div className={`transition-all duration-700 delay-${index * 200} ${isVisible[index + 1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative h-64 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Destaque
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center gap-4 text-white text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {article.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{article.author}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(article.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors group">
                          Ler artigo
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lista de Artigos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-animate>
            <div className={`transition-all duration-700 ${isVisible[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {selectedCategory === 'todos' ? 'Todos os Artigos' : 
                 categories.find(cat => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-xl text-gray-600">
                {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer" data-animate onClick={() => openArticle(article)}>
                <div className={`transition-all duration-700 delay-${index * 100} ${isVisible[index + 4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="relative h-48 bg-gradient-to-r from-gray-600 to-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                        article.category === 'ia-industrial' ? 'bg-blue-500' :
                        article.category === 'atendimento' ? 'bg-green-500' :
                        article.category === 'logistica' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {article.category === 'ia-industrial' ? 'IA Industrial' :
                         article.category === 'atendimento' ? 'Atendimento' :
                         article.category === 'logistica' ? 'Logística' : article.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {article.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.author}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(article.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-orange-500 hover:text-orange-600 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termo de busca para encontrar o conteúdo que procura.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('todos');
                  setSearchTerm('');
                }}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Artigo */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    selectedArticle.category === 'ia-industrial' ? 'bg-blue-500' :
                    selectedArticle.category === 'atendimento' ? 'bg-green-500' :
                    selectedArticle.category === 'logistica' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    {selectedArticle.category === 'ia-industrial' ? 'IA Industrial' :
                     selectedArticle.category === 'atendimento' ? 'Atendimento' :
                     selectedArticle.category === 'logistica' ? 'Logística' : selectedArticle.category}
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedArticle.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {selectedArticle.views}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Botões de Compartilhamento */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => shareArticle('facebook')}
                      className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      title="Compartilhar no Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareArticle('twitter')}
                      className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                      title="Compartilhar no Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareArticle('linkedin')}
                      className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                      title="Compartilhar no LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareArticle('copy')}
                      className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                      title="Copiar link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Conteúdo do Modal */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Título e Metadados */}
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {selectedArticle.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {selectedArticle.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{selectedArticle.author}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(selectedArticle.date).toLocaleDateString('pt-BR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedArticle.tags.map((tag, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-orange-500 pl-6 bg-orange-50 py-4 rounded-r-lg">
                      {selectedArticle.excerpt}
                    </p>
                  </div>
                  
                  {/* Conteúdo do Artigo */}
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                  
                  {/* Footer do Artigo */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {selectedArticle.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{selectedArticle.author}</h4>
                          <p className="text-gray-600">
                            Especialista em IA Industrial • AutoPanel
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Publicado em {new Date(selectedArticle.date).toLocaleDateString('pt-BR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          <span>{selectedArticle.views} visualizações</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span>{selectedArticle.readTime} de leitura</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fique por Dentro das <span className="text-orange-200">Novidades</span>
          </h2>
          
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Receba semanalmente os melhores insights sobre IA industrial, automação e tendências tecnológicas 
            diretamente no seu e-mail.
          </p>
          
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300"
              />
              <button className="bg-white text-orange-500 px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg">
                <Globe className="w-5 h-5" />
                Inscrever-se
              </button>
            </div>
            <p className="text-orange-200 text-sm mt-4">
              Sem spam. Cancele a qualquer momento. Mais de 10.000+ engenheiros já assinam.
            </p>
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