// Sistema de animações avançadas para o Blog Vynlo

export const animations = {
  // Animações de entrada
  fadeInUp: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  fadeInScale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  },

  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Animações de hover
  hoverLift: {
    whileHover: { 
      y: -8, 
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    whileTap: { scale: 0.98 }
  },

  hoverRotate: {
    whileHover: { 
      rotate: 6,
      scale: 1.1,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
    }
  },

  hoverGlow: {
    whileHover: {
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
      transition: { duration: 0.3 }
    }
  },

  // Animações de loading
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0']
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },

  // Animações de contadores
  countUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Animações de stagger
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Efeitos de ripple para cliques
export const createRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    pointer-events: none;
  `
  
  button.style.position = 'relative'
  button.style.overflow = 'hidden'
  button.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// CSS para animações customizadas
export const customAnimationCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
  }

  @keyframes morphGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }

  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .animate-morph-gradient {
    background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
    background-size: 400% 400%;
    animation: morphGradient 4s ease infinite;
  }

  .hover-lift {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .hover-lift:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .hover-3d {
    transition: all 0.3s ease;
    transform-style: preserve-3d;
  }

  .hover-3d:hover {
    transform: perspective(1000px) rotateX(10deg) rotateY(-10deg) translateZ(20px);
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .neon-glow {
    box-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px currentColor;
  }
`

// Hook para animações de scroll
export const useScrollAnimation = () => {
  const observeElements = (selector: string, animationClass: string) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll(selector).forEach((el) => {
      observer.observe(el)
    })

    return observer
  }

  return { observeElements }
}

// Animações de números (contadores)
export const animateNumber = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 2000
) => {
  const startTime = performance.now()
  
  const updateNumber = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(start + (end - start) * easeOut)
    
    element.textContent = current.toLocaleString()
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }
  
  requestAnimationFrame(updateNumber)
}

// Partículas flutuantes
export const createFloatingParticles = (container: HTMLElement, count: number = 20) => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.className = 'absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 3 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's'
    container.appendChild(particle)
  }
}