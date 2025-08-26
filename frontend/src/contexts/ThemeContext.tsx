'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  currentTheme: string
  toggleTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light')

  // Função para alternar tema
  const toggleTheme = (theme: string) => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    
    // Forçar re-render de todos os componentes
    window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }))
  }

  // Efeito para carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  // Efeito para detectar mudanças de tema
  useEffect(() => {
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark'
      setCurrentTheme(theme)
    }

    // Observar mudanças no atributo data-theme
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    // Escutar eventos de mudança de tema
    const handleThemeEvent = (event: CustomEvent) => {
      setCurrentTheme(event.detail)
    }
    window.addEventListener('themeChange', handleThemeEvent as EventListener)

    return () => {
      observer.disconnect()
      window.removeEventListener('themeChange', handleThemeEvent as EventListener)
    }
  }, [])

  const value = {
    currentTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}


