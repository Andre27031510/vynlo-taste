'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, ChevronDown } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-vynlo-dark/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-white font-manrope font-bold text-xl">
                Vynlo <span className="text-blue-400">Taste</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
            >
              Recursos
            </Link>
            <Link 
              href="#solutions" 
              className="text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
            >
              Soluções
            </Link>
            <Link 
              href="#faq" 
              className="text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link 
              href="#pricing" 
              className="text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
            >
              Preços
            </Link>
            <Link 
              href="#contact" 
              className="text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
            >
              Contato
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-manrope font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <User size={18} />
              <span>Área do Cliente</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-vynlo-dark/95 backdrop-blur-sm border-t border-gray-800">
              <Link
                href="#features"
                className="block px-3 py-2 text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                href="#solutions"
                className="block px-3 py-2 text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Soluções
              </Link>
              <Link
                href="#faq"
                className="block px-3 py-2 text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-white font-manrope font-medium hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link
                href="/login"
                className="flex items-center space-x-2 mx-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-manrope font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} />
                <span>Área do Cliente</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}