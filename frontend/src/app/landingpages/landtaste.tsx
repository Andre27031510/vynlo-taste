'use client';

import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Solutions from '@/components/landing/Solutions'
import Testimonials from '@/components/landing/Testimonials'
import TechStack from '@/components/landing/TechStack'
import FAQ from '@/components/landing/FAQ'
import Contact from '@/components/landing/Contact'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'



// Banner de Transição
function TransitionBanner() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-orange-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-6">
        <div>
          <h3 className="text-white text-2xl font-bold mb-2 font-manrope">
            Sistema Completo para Restaurantes
          </h3>
          <p className="text-green-100 text-lg font-manrope">
            Gestão de Pedidos • Controle de Estoque • Delivery Integrado • Relatórios Avançados
          </p>
        </div>
        <a 
          href="/login" 
          className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-manrope whitespace-nowrap"
        >
          Começar Agora
        </a>
      </div>
    </div>
  )
}

export default function LandTaste() {
  return (
    <main className="min-h-screen">
      <Header />
      <div>
        <Hero />
      <Features />

      <Solutions />
      <Testimonials />
      <TechStack />
      <FAQ />

        <Contact />
        <TransitionBanner />
      </div>
      <Footer />
    </main>
  )
}
// Test SSH open
