'use client'

import React, { useState } from 'react'
import { Mail, Bell, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { newsletterService } from '../../services/newsletterService'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')

  // Validação de email em tempo real
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('')
    } else if (!regex.test(email)) {
      setEmailError('Email inválido')
    } else {
      setEmailError('')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Email é obrigatório')
      return
    }
    
    if (emailError) {
      setError('Corrija o email antes de continuar')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await newsletterService.subscribeNewsletter(email)
      
      if (result.success) {
        setSuccess(true)
        setEmail('')
        
        // Reset após 5 segundos
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section data-section="newsletter" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-6 py-3 mb-8">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-manrope font-semibold text-sm">Newsletter</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Receba insights
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              semanalmente
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed mb-12">
            Junte-se a <strong>centenas de empresas</strong> que recebem os melhores conteúdos sobre gestão empresarial, cases de sucesso e dicas exclusivas
          </p>

          {success ? (
            <div className="max-w-2xl mx-auto mb-12 p-6 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center justify-center gap-3 text-green-700">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-manrope font-semibold">Inscrição realizada com sucesso!</span>
              </div>
              <p className="text-green-600 mt-2 text-sm">Você receberá nossos conteúdos exclusivos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Seu melhor email"
                    disabled={loading}
                    className={`w-full bg-gray-50 border rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-500 font-manrope focus:outline-none focus:bg-white transition-all duration-300 ${
                      emailError ? 'border-red-300 focus:border-red-400' : 
                      email && !emailError ? 'border-green-300 focus:border-green-400' :
                      'border-gray-200 focus:border-blue-400'
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1 text-left">{emailError}</p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={loading || !!emailError || !email.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Enviando...' : 'Assinar Grátis'}</span>
                </button>
              </div>
              
              {error && (
                <div className="flex items-center justify-center gap-2 text-red-600 mt-4">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </form>
          )}

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Conteúdo exclusivo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sem spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}