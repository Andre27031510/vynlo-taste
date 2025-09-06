/// <reference types="cypress" />

/**
 * Testes de Responsividade - Vynlo Taste Dashboard
 * Verifica se os componentes se adaptam corretamente a diferentes tamanhos de tela
 */

describe('Responsividade do Dashboard', () => {
  // Configurações de viewport para diferentes dispositivos
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Tablet Large', width: 1024, height: 768 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ]

  beforeEach(() => {
    // Interceptar chamadas de API para evitar erros em testes
    cy.intercept('GET', '/api/**', { fixture: 'api-response.json' }).as('apiCall')
    
    // Visitar a página do dashboard
    cy.visit('/dashboard')
  })

  viewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
      })

      it('deve renderizar o sidebar corretamente', () => {
        // Verificar se o sidebar existe
        cy.get('[role="navigation"]').should('exist')

        if (viewport.width <= 768) {
          // Mobile: sidebar deve estar oculto inicialmente
          cy.get('[role="navigation"]').should('have.class', '-translate-x-full')
          
          // Botão de menu mobile deve estar visível
          cy.get('button[aria-label*="menu"]').should('be.visible')
          
          // Clicar no botão deve abrir o menu
          cy.get('button[aria-label*="menu"]').click()
          cy.get('[role="navigation"]').should('have.class', 'translate-x-0')
          
          // Overlay deve estar visível
          cy.get('.bg-black.bg-opacity-50').should('be.visible')
          
        } else if (viewport.width <= 1024) {
          // Tablet: sidebar deve estar colapsado
          cy.get('[role="navigation"]').should('have.class', 'w-16')
          
        } else {
          // Desktop: sidebar deve estar expandido
          cy.get('[role="navigation"]').should('have.class', 'w-64')
        }
      })

      it('deve adaptar o layout dos cards de métricas', () => {
        // Verificar se os cards existem
        cy.get('.grid').should('exist')

        if (viewport.width <= 768) {
          // Mobile: uma coluna
          cy.get('.grid').should('have.class', 'grid-cols-1')
          
        } else if (viewport.width <= 1024) {
          // Tablet: duas colunas
          cy.get('.grid').should('satisfy', ($el) => {
            return $el.hasClass('sm:grid-cols-2') || $el.hasClass('md:grid-cols-2')
          })
          
        } else {
          // Desktop: quatro colunas
          cy.get('.grid').should('satisfy', ($el) => {
            return $el.hasClass('lg:grid-cols-4') || $el.hasClass('xl:grid-cols-4')
          })
        }
      })

      it('deve ajustar o tamanho dos textos e espaçamentos', () => {
        // Verificar títulos responsivos
        cy.get('h1').should('exist').then(($title) => {
          if (viewport.width <= 768) {
            // Mobile: texto menor
            expect($title).to.satisfy(($el: any) => {
              return $el.hasClass('text-2xl') || $el.hasClass('text-xl')
            })
          } else {
            // Desktop/Tablet: texto maior
            expect($title).to.satisfy(($el: any) => {
              return $el.hasClass('text-3xl') || $el.hasClass('text-2xl')
            })
          }
        })

        // Verificar espaçamentos responsivos
        cy.get('.space-y-4, .space-y-6').should('exist')
      })

      it('deve funcionar corretamente em modais', () => {
        // Simular abertura de modal (se existir botão)
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Adicionar")').length > 0) {
            cy.get('button:contains("Adicionar")').first().click()
            
            // Verificar se o modal se adapta ao viewport
            cy.get('[role="dialog"]').should('be.visible').then(($modal) => {
              if (viewport.width <= 768) {
                // Mobile: modal deve ocupar quase toda a tela
                expect($modal.find('.w-full')).to.exist
              } else {
                // Desktop/Tablet: modal com largura limitada
                expect($modal.find('.max-w-md, .max-w-lg, .max-w-xl')).to.exist
              }
            })

            // Verificar se o modal tem scroll quando necessário
            cy.get('[role="dialog"] .overflow-y-auto').should('exist')
            
            // Fechar modal
            cy.get('button[aria-label*="Fechar"]').click()
          }
        })
      })

      it('deve manter a navegação acessível', () => {
        // Verificar se elementos focáveis estão visíveis
        cy.get('button, input, select, a').should('be.visible')
        
        // Testar navegação por teclado
        cy.get('button, input, select, a').first().focus()
        cy.focused().should('exist')
        
        // Verificar se focus rings estão funcionando
        cy.focused().should('have.class', 'focus:ring-2')
      })

      it('deve adaptar formulários e inputs', () => {
        cy.get('body').then(($body) => {
          if ($body.find('input, select').length > 0) {
            // Verificar se inputs se adaptam à largura
            cy.get('input, select').each(($input) => {
              if (viewport.width <= 768) {
                // Mobile: inputs devem ocupar largura total
                expect($input).to.satisfy(($el: any) => {
                  return $el.hasClass('w-full') || $el.parent().hasClass('w-full')
                })
              }
            })
          }
        })
      })

      it('deve manter performance em diferentes resoluções', () => {
        // Verificar se a página carrega rapidamente
        cy.get('[role="navigation"]').should('be.visible')
        
        // Verificar se não há elementos quebrados
        cy.get('img').should('be.visible')
        
        // Verificar se não há overflow horizontal
        cy.window().then((win) => {
          expect(win.document.body.scrollWidth).to.be.at.most(viewport.width + 20)
        })
      })

      it('deve funcionar gestos touch em mobile', () => {
        if (viewport.width <= 768) {
          // Simular gestos de swipe no sidebar
          cy.get('[role="navigation"]').then(($sidebar) => {
            if ($sidebar.hasClass('-translate-x-full')) {
              // Tentar abrir menu com gesto
              cy.get('button[aria-label*="menu"]').click()
              cy.get('[role="navigation"]').should('have.class', 'translate-x-0')
            }
          })
          
          // Verificar se elementos são grandes o suficiente para touch
          cy.get('button').each(($button) => {
            const rect = $button[0].getBoundingClientRect()
            expect(rect.height).to.be.at.least(44) // Mínimo recomendado para touch
          })
        }
      })
    })
  })

  // Testes específicos para transições entre breakpoints
  describe('Transições entre Breakpoints', () => {
    it('deve transicionar suavemente de mobile para desktop', () => {
      // Começar em mobile
      cy.viewport(375, 667)
      cy.get('[role="navigation"]').should('have.class', '-translate-x-full')
      
      // Mudar para desktop
      cy.viewport(1280, 720)
      cy.get('[role="navigation"]').should('have.class', 'w-64')
      
      // Verificar se a transição foi suave (sem quebras)
      cy.get('[role="navigation"]').should('be.visible')
    })

    it('deve manter estado do menu ao redimensionar', () => {
      // Desktop com menu expandido
      cy.viewport(1280, 720)
      cy.get('[role="navigation"]').should('have.class', 'w-64')
      
      // Redimensionar para tablet
      cy.viewport(768, 1024)
      cy.get('[role="navigation"]').should('exist')
      
      // Menu deve se adaptar mas manter funcionalidade
      cy.get('[role="menubar"]').should('be.visible')
    })
  })

  // Testes de acessibilidade em diferentes tamanhos
  describe('Acessibilidade Responsiva', () => {
    viewports.slice(0, 3).forEach((viewport) => {
      it(`deve manter acessibilidade em ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height)
        
        // Verificar se todos os elementos têm labels apropriados
        cy.get('button').each(($button) => {
          expect($button).to.satisfy(($el: any) => {
            return $el.attr('aria-label') || $el.text().trim().length > 0
          })
        })
        
        // Verificar se navegação por teclado funciona
        cy.get('button, input, select, a').first().focus()
        cy.focused().should('be.visible')
        
        // Verificar contraste (elementos devem ser visíveis)
        cy.get('button, a').should('be.visible')
      })
    })
  })
})

// Configuração do Cypress
export {}