'use client'

import { useState, useEffect } from 'react'
import { 
  Shield,
  Lock,
  Eye,
  FileCheck,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function BusinessSecurity() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('BusinessSecurity')
  }, [])

  return (
    <section 
      data-section="business-security" 
      className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">
              Segurança Empresarial
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-8 leading-tight">
            Seus dados protegidos com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              segurança bancária
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed">
            Proteção total dos seus dados empresariais com os mesmos padrões de segurança utilizados por bancos e grandes corporações.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-manrope font-bold text-white">
                Proteção Multicamadas
              </h3>
              <p className="text-lg text-gray-300 font-manrope leading-relaxed">
                Seus dados passam por múltiplas camadas de proteção: criptografia de nível bancário, autenticação dupla, monitoramento 24/7 e backups automáticos em servidores seguros.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Lock, title: 'Criptografia Bancária', desc: 'Mesma proteção usada por bancos' },
                { icon: UserCheck, title: 'Autenticação Dupla', desc: 'Acesso seguro para sua equipe' },
                { icon: Eye, title: 'Monitoramento 24/7', desc: 'Vigilância constante contra ameaças' },
                { icon: FileCheck, title: 'Backups Automáticos', desc: 'Seus dados sempre seguros' }
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-manrope font-semibold">{item.title}</div>
                      <div className="text-gray-400 font-manrope text-sm">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-white font-manrope">Sistema Seguro</span>
                  </div>
                  <span className="text-green-400 font-manrope font-bold">100%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-400" />
                    <span className="text-white font-manrope">Conformidade LGPD</span>
                  </div>
                  <span className="text-blue-400 font-manrope font-bold">Certificado</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-purple-400" />
                    <span className="text-white font-manrope">Incidentes de Segurança</span>
                  </div>
                  <span className="text-purple-400 font-manrope font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '5+ Anos', label: 'Zero Incidentes', icon: Shield },
            { value: '256-bit', label: 'Criptografia', icon: Lock },
            { value: '99.98%', label: 'Disponibilidade', icon: CheckCircle },
            { value: 'LGPD', label: 'Conformidade', icon: FileCheck }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-manrope font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-manrope font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}