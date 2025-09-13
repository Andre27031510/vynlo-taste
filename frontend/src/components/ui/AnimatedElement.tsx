'use client'

import { useEffect, useRef, useState } from 'react'
import { animations, createRippleEffect, animateNumber } from '../../utils/animations'

interface AnimatedElementProps {
  children: React.ReactNode
  animation?: keyof typeof animations
  delay?: number
  duration?: number
  className?: string
  onClick?: (e: React.MouseEvent) => void
  ripple?: boolean
  hover3d?: boolean
  glow?: boolean
  float?: boolean
  countUp?: { start: number; end: number; duration?: number }
}

export default function AnimatedElement({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration,
  className = '',
  onClick,
  ripple = false,
  hover3d = false,
  glow = false,
  float = false,
  countUp
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay, hasAnimated])

  useEffect(() => {
    if (isVisible && countUp && elementRef.current) {
      animateNumber(elementRef.current, countUp.start, countUp.end, countUp.duration)
    }
  }, [isVisible, countUp])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ripple) {
      createRippleEffect(e)
    }
    onClick?.(e)
  }

  const getAnimationClasses = () => {
    let classes = className
    
    if (!isVisible) {
      classes += ' opacity-0 translate-y-8 scale-95'
    } else {
      classes += ' opacity-100 translate-y-0 scale-100'
    }
    
    if (hover3d) classes += ' hover-3d'
    if (glow) classes += ' animate-glow'
    if (float) classes += ' animate-float'
    
    return classes
  }

  const getTransitionStyle = () => {
    const animationConfig = animations[animation]
    const defaultDuration = animationConfig && 'transition' in animationConfig ? animationConfig.transition.duration : 0.6
    return {
      transition: `all ${duration || defaultDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}ms`
    }
  }

  return (
    <div
      ref={elementRef}
      className={getAnimationClasses()}
      style={getTransitionStyle()}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

// Componente para stagger animations
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ 
  children, 
  className = '', 
  staggerDelay = 100 
}: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedElement
          key={index}
          delay={isVisible ? index * staggerDelay : 0}
          animation="fadeInUp"
        >
          {child}
        </AnimatedElement>
      ))}
    </div>
  )
}

// Componente para loading skeleton animado
interface SkeletonProps {
  className?: string
  lines?: number
  avatar?: boolean
}

export function AnimatedSkeleton({ className = '', lines = 3, avatar = false }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="w-12 h-12 bg-gray-300 rounded-full mb-4 animate-shimmer"></div>
      )}
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-300 rounded animate-shimmer mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        ></div>
      ))}
    </div>
  )
}

// Componente para progress bar animada
interface AnimatedProgressProps {
  progress: number
  className?: string
  color?: string
  showPercentage?: boolean
}

export function AnimatedProgress({ 
  progress, 
  className = '', 
  color = 'bg-blue-600',
  showPercentage = false 
}: AnimatedProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${animatedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
      {showPercentage && (
        <span className="absolute right-0 top-0 text-sm font-semibold text-gray-700 -mt-6">
          {Math.round(animatedProgress)}%
        </span>
      )}
    </div>
  )
}

// Componente para botão com efeitos avançados
interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  glow?: boolean
  ripple?: boolean
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  glow = false,
  ripple = true
}: AnimatedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
      case 'secondary':
        return 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'
      case 'ghost':
        return 'bg-transparent text-gray-600 hover:bg-gray-100'
      default:
        return ''
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return ''
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      createRippleEffect(e)
    }
    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden font-manrope font-bold rounded-xl
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:-translate-y-1
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${glow ? 'animate-glow' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}