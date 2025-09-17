'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Soluções', href: '/solucoes' },
    { name: 'Contato', href: '/contato' },
  ]

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-industrial-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-industrial-900">AutoPanel</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-industrial-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-industrial-600 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-gradient-orange text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transform transition-all duration-200"
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-industrial-600 hover:text-industrial-900 p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-industrial-100">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-industrial-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-industrial-100 pt-4 mt-4">
              <Link
                href="/login"
                className="block px-3 py-2 text-industrial-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="block mx-3 mt-2 bg-gradient-orange text-white px-4 py-2 rounded-lg font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}