import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    setupNodeEvents(on, config) {
      // Configurações adicionais podem ser adicionadas aqui
    },
    
    // Configurações específicas para testes de responsividade
    env: {
      // URLs de teste
      dashboardUrl: '/dashboard',
      
      // Breakpoints do Tailwind CSS
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      }
    },
    
    // Padrões de arquivos de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Configurações de retry para testes flaky
    retries: {
      runMode: 2,
      openMode: 0
    }
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})