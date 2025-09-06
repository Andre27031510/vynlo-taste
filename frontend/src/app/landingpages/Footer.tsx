'use client'

import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vynlo Tech
                </h3>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Transformando negócios com tecnologia de ponta. Soluções inteligentes que automatizam processos e impulsionam resultados.
              </p>
              
              {/* Informações de Contato */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href="mailto:contato@vynlotech.com" className="hover:text-blue-400 transition-colors">
                    contato@vynlotech.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  <span>Seg - Sex: 8h às 18h</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575-.105.79-.251.79-.546v-1.916c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12.25 24 5.896 18.854.75 12.5.75z"/>
                  </svg>
                </a>
              </div>
            </div>



            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Empresa</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/sobre" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/carreiras" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/imprensa" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Imprensa
                  </Link>
                </li>
                <li>
                  <Link href="/parceiros" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Parceiros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Suporte</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/landingpages/contatolandprincipal" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Entre em Contato
                  </Link>
                </li>
                <li>
                  <Link href="/suporte" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-slate-300 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                    Status do Sistema
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/integracao" className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
                    Integrações
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 pt-12 border-t border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Fique por dentro das novidades
                </h4>
                <p className="text-slate-300">
                  Receba atualizações sobre novos produtos, recursos e insights do mercado.
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                  Inscrever
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Disponibilidade</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">2.500+</div>
                <div className="text-sm text-slate-400">Empresas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-sm text-slate-400">Suporte</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">AWS</div>
                <div className="text-sm text-slate-400">Infraestrutura</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © 2024 Vynlo Tech. Todos os direitos reservados.
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/privacidade" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  Política de Privacidade
                </Link>
                <Link href="/termos" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  Termos de Uso
                </Link>
                <Link href="/cookies" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  Cookies
                </Link>
                <Link href="/lgpd" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  LGPD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer