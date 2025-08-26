import Header from '@/components/layout/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Solutions from '@/components/landing/Solutions'
import Testimonials from '@/components/landing/Testimonials'
import TechStack from '@/components/landing/TechStack'
import FAQ from '@/components/landing/FAQ'
import Pricing from '@/components/landing/Pricing'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Solutions />
      <Testimonials />
      <TechStack />
      <FAQ />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  )
}