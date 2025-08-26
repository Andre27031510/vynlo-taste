'use client'

import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Heart
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-vynlo-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-white font-manrope font-bold text-2xl">
                Vynlo <span className="text-blue-400">Taste</span>
              </span>
            </div>
            
            <p className="text-gray-300 font-manrope leading-relaxed">
              Revolucionando a gestão de restaurantes com tecnologia de ponta. 
              Sua solução completa para um negócio mais eficiente e lucrativo.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map((social, index) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h3 className="text-xl font-manrope font-bold text-white">Soluções</h3>
            <ul className="space-y-3">
              {[
                'Gestão de Pedidos',
                'Controle de Estoque',
                'Relatórios Avançados',
                'Integração Delivery',
                'Sistema de Pagamentos',
                'Gestão de Equipe'
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 font-manrope transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-manrope font-bold text-white">Suporte</h3>
            <ul className="space-y-3">
              {[
                'Central de Ajuda',
                'Documentação',
                'Tutoriais em Vídeo',
                'Suporte Técnico',
                'Treinamentos',
                'Status do Sistema'
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 font-manrope transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-manrope font-bold text-white">Contato</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-manrope">
                    Av. Paulista, 1000<br />
                    São Paulo - SP<br />
                    01310-100
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <Link 
                  href="tel:+5511999999999" 
                  className="text-gray-300 hover:text-blue-400 font-manrope transition-colors duration-200"
                >
                  (11) 99999-9999
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <Link 
                  href="mailto:contato@vynlotaste.com" 
                  className="text-gray-300 hover:text-blue-400 font-manrope transition-colors duration-200"
                >
                  contato@vynlotaste.com
                </Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-manrope font-semibold text-white mb-3">
                Newsletter
              </h4>
              <p className="text-gray-300 font-manrope text-sm mb-4">
                Receba novidades e dicas exclusivas
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white font-manrope focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors duration-200">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            <div className="flex items-center space-x-2 text-gray-300 font-manrope">
              <span>© {currentYear} Vynlo Taste. Todos os direitos reservados.</span>
            </div>

            <div className="flex items-center space-x-6">
              <Link 
                href="#" 
                className="text-gray-300 hover:text-blue-400 font-manrope text-sm transition-colors duration-200"
              >
                Política de Privacidade
              </Link>
              <Link 
                href="#" 
                className="text-gray-300 hover:text-blue-400 font-manrope text-sm transition-colors duration-200"
              >
                Termos de Uso
              </Link>
              <Link 
                href="#" 
                className="text-gray-300 hover:text-blue-400 font-manrope text-sm transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-gray-300 font-manrope text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>pela equipe Vynlo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}