'use client'

export default function SupportCTA() {
  return (
    <section data-section="cta" className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Ainda precisa de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              ajuda?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed">
            Nossa equipe técnica especializada está pronta para resolver qualquer dúvida ou problema que você possa ter
          </p>
        </div>
      </div>
    </section>
  )
}