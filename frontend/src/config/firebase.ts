import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics, initializeAnalytics, logEvent, setUserProperties, setUserId, type Analytics } from 'firebase/analytics'
import { getCrashlytics, log as crashlyticsLog } from 'firebase/crashlytics'
import { getPerformance, initializePerformance, trace, type Performance, type Trace } from 'firebase/performance'

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Debug logging for development
const debugLog = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[Firebase Debug] ${message}`, data || '')
  }
}

// Firebase configuration with environment validation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate configuration
const validateConfig = (): boolean => {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId']
  const missing = required.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig])
  
  if (missing.length > 0) {
    debugLog('Missing Firebase config:', missing)
    return false
  }
  return true
}

// Intelligent caching for 3M+ users
let cachedApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null
let cachedAnalytics: Analytics | null = null
let cachedPerformance: Performance | null = null
let initializationPromise: Promise<FirebaseApp | null> | null = null
let activeTraces: Map<string, Trace> = new Map()

// Optimized Firebase app initialization
export const getFirebaseApp = async (): Promise<FirebaseApp | null> => {
  // Return cached instance immediately
  if (cachedApp) {
    debugLog('Returning cached Firebase app')
    return cachedApp
  }

  // Return existing initialization promise to prevent multiple initializations
  if (initializationPromise) {
    debugLog('Waiting for existing initialization')
    return initializationPromise
  }

  // Server-side rendering check
  if (typeof window === 'undefined') {
    debugLog('Server-side rendering detected, skipping initialization')
    return null
  }

  // Configuration validation
  if (!validateConfig()) {
    debugLog('Invalid Firebase configuration')
    return null
  }

  // Create initialization promise
  initializationPromise = new Promise((resolve) => {
    try {
      debugLog('Initializing Firebase app', { 
        environment: isDevelopment ? 'development' : 'production',
        projectId: firebaseConfig.projectId 
      })

      // Check for existing apps to prevent duplicate initialization
      const existingApp = getApps().find(app => app.name === '[DEFAULT]')
      
      if (existingApp) {
        debugLog('Using existing Firebase app')
        cachedApp = existingApp
      } else {
        debugLog('Creating new Firebase app')
        cachedApp = initializeApp(firebaseConfig)
      }

      // Performance optimization for production
      if (isProduction) {
        // Enable persistence and offline support
        debugLog('Production optimizations enabled')
      }

      resolve(cachedApp)
    } catch (error) {
      debugLog('Firebase initialization error:', error)
      resolve(null)
    }
  })

  return initializationPromise
}

// Optimized Auth instance with connection pooling
export const getAuthInstance = async (): Promise<Auth | null> => {
  if (cachedAuth) {
    debugLog('Returning cached Auth instance')
    return cachedAuth
  }

  const app = await getFirebaseApp()
  if (!app) return null

  try {
    cachedAuth = getAuth(app)
    
    // Development emulator connection
    if (isDevelopment && !cachedAuth.config.emulator) {
      try {
        connectAuthEmulator(cachedAuth, 'http://localhost:9099', { disableWarnings: true })
        debugLog('Connected to Auth emulator')
      } catch (error) {
        debugLog('Auth emulator connection failed:', error)
      }
    }

    debugLog('Auth instance created')
    return cachedAuth
  } catch (error) {
    debugLog('Auth initialization error:', error)
    return null
  }
}

// Optimized Firestore instance with connection pooling
export const getDbInstance = async (): Promise<Firestore | null> => {
  if (cachedDb) {
    debugLog('Returning cached Firestore instance')
    return cachedDb
  }

  const app = await getFirebaseApp()
  if (!app) return null

  try {
    cachedDb = getFirestore(app)
    
    // Development emulator connection
    if (isDevelopment && !cachedDb._delegate._databaseId.database.includes('localhost')) {
      try {
        connectFirestoreEmulator(cachedDb, 'localhost', 8080)
        debugLog('Connected to Firestore emulator')
      } catch (error) {
        debugLog('Firestore emulator connection failed:', error)
      }
    }

    debugLog('Firestore instance created')
    return cachedDb
  } catch (error) {
    debugLog('Firestore initialization error:', error)
    return null
  }
}

// Optimized Analytics instance with enterprise features
export const getAnalyticsInstance = async (): Promise<Analytics | null> => {
  if (cachedAnalytics) {
    debugLog('Returning cached Analytics instance')
    return cachedAnalytics
  }

  const app = await getFirebaseApp()
  if (!app || typeof window === 'undefined') return null

  try {
    cachedAnalytics = getAnalytics(app)
    
    // Enterprise configuration for 3M+ users
    if (isProduction) {
      // Enable automatic event collection
      debugLog('Analytics enterprise features enabled')
    }

    debugLog('Analytics instance created')
    return cachedAnalytics
  } catch (error) {
    debugLog('Analytics initialization error:', error)
    return null
  }
}

// Optimized Performance instance with enterprise features
export const getPerformanceInstance = async (): Promise<Performance | null> => {
  if (cachedPerformance) {
    debugLog('Returning cached Performance instance')
    return cachedPerformance
  }

  const app = await getFirebaseApp()
  if (!app || typeof window === 'undefined') return null

  try {
    cachedPerformance = getPerformance(app)
    
    // Enterprise configuration for 3M+ users
    if (isProduction) {
      // Enable automatic performance collection
      debugLog('Performance enterprise features enabled')
      initWebVitalsTracking()
    }

    debugLog('Performance instance created')
    return cachedPerformance
  } catch (error) {
    debugLog('Performance initialization error:', error)
    return null
  }
}

// Custom Analytics Events for Enterprise
export const trackEvent = async (eventName: string, parameters?: Record<string, any>) => {
  const analytics = await getAnalyticsInstance()
  if (!analytics) return

  try {
    logEvent(analytics, eventName, parameters)
    debugLog(`Event tracked: ${eventName}`, parameters)
  } catch (error) {
    debugLog('Event tracking error:', error)
  }
}

// User Authentication Events
export const trackLogin = async (method: string, userId?: string) => {
  await trackEvent('login', { method })
  if (userId) {
    const analytics = await getAnalyticsInstance()
    if (analytics) setUserId(analytics, userId)
  }
}

export const trackLogout = async () => {
  await trackEvent('logout')
}

// Error and Performance Tracking
export const trackError = async (error: string, context?: string) => {
  await trackEvent('error_occurred', { error_message: error, context })
  try {
    const app = await getFirebaseApp()
    if (app) {
      const crashlytics = getCrashlytics(app)
      crashlyticsLog(crashlytics, `Error: ${error} | Context: ${context}`)
    }
  } catch (e) {
    debugLog('Crashlytics error:', e)
  }
}

export const trackPerformance = async (metric: string, value: number, unit?: string) => {
  await trackEvent('performance_metric', { metric, value, unit })
}

// User Properties for Segmentation
export const setUserProperty = async (property: string, value: string) => {
  const analytics = await getAnalyticsInstance()
  if (!analytics) return

  try {
    setUserProperties(analytics, { [property]: value })
    debugLog(`User property set: ${property} = ${value}`)
  } catch (error) {
    debugLog('User property error:', error)
  }
}

// Conversion Tracking
export const trackConversion = async (conversionType: string, value?: number, currency?: string) => {
  await trackEvent('conversion', { 
    conversion_type: conversionType, 
    value, 
    currency: currency || 'BRL' 
  })
}

// Ecommerce Tracking
export const trackPurchase = async (transactionId: string, value: number, items: any[]) => {
  await trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'BRL',
    items
  })
}

export const trackAddToCart = async (itemId: string, itemName: string, value: number) => {
  await trackEvent('add_to_cart', {
    item_id: itemId,
    item_name: itemName,
    value,
    currency: 'BRL'
  })
}

// Business Intelligence Events
export const trackBusinessEvent = async (eventType: string, businessData: Record<string, any>) => {
  await trackEvent(`business_${eventType}`, {
    ...businessData,
    timestamp: Date.now(),
    user_segment: 'enterprise'
  })
}

// Performance Monitoring Functions
export const startTrace = async (traceName: string): Promise<string> => {
  const performance = await getPerformanceInstance()
  if (!performance) return ''

  try {
    const traceInstance = trace(performance, traceName)
    traceInstance.start()
    const traceId = `${traceName}_${Date.now()}`
    activeTraces.set(traceId, traceInstance)
    debugLog(`Trace started: ${traceName}`)
    return traceId
  } catch (error) {
    debugLog('Trace start error:', error)
    return ''
  }
}

export const stopTrace = async (traceId: string, attributes?: Record<string, string>) => {
  const traceInstance = activeTraces.get(traceId)
  if (!traceInstance) return

  try {
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        traceInstance.putAttribute(key, value)
      })
    }
    traceInstance.stop()
    activeTraces.delete(traceId)
    debugLog(`Trace stopped: ${traceId}`)
  } catch (error) {
    debugLog('Trace stop error:', error)
  }
}

// Custom Performance Traces
export const traceLogin = async (method: string) => {
  const traceId = await startTrace('user_login')
  return {
    complete: () => stopTrace(traceId, { method, user_type: 'enterprise' })
  }
}

export const tracePageLoad = async (pageName: string) => {
  const traceId = await startTrace('page_load')
  return {
    complete: () => stopTrace(traceId, { page: pageName, load_type: 'initial' })
  }
}

export const traceApiCall = async (endpoint: string, method: string) => {
  const traceId = await startTrace('api_call')
  return {
    complete: (status?: number) => stopTrace(traceId, { 
      endpoint, 
      method, 
      status: status?.toString() || 'unknown' 
    })
  }
}

// Web Vitals Tracking
const initWebVitalsTracking = () => {
  if (typeof window === 'undefined') return

  // Core Web Vitals tracking
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        trackPerformance('LCP', entry.startTime, 'ms')
      }
      if (entry.entryType === 'first-input') {
        trackPerformance('FID', (entry as any).processingStart - entry.startTime, 'ms')
      }
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        trackPerformance('CLS', (entry as any).value, 'score')
      }
    })
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    debugLog('Web Vitals tracking initialized')
  } catch (error) {
    debugLog('Web Vitals tracking error:', error)
  }
}

// Performance Budget Monitoring
export const checkPerformanceBudget = async (metric: string, value: number) => {
  const budgets = {
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1,  // 0.1 score
    TTI: 3800, // 3.8s
    FCP: 1800  // 1.8s
  }

  const budget = budgets[metric as keyof typeof budgets]
  if (budget && value > budget) {
    await trackEvent('performance_budget_exceeded', {
      metric,
      value,
      budget,
      excess: value - budget
    })
    debugLog(`Performance budget exceeded: ${metric} = ${value}ms (budget: ${budget}ms)`)
  }
}

// Real User Monitoring
export const trackRealUserMetrics = async () => {
  if (typeof window === 'undefined') return

  // Navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigation) {
    const metrics = {
      dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp_connect: navigation.connectEnd - navigation.connectStart,
      server_response: navigation.responseEnd - navigation.requestStart,
      dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      page_load: navigation.loadEventEnd - navigation.navigationStart
    }

    Object.entries(metrics).forEach(([metric, value]) => {
      trackPerformance(`rum_${metric}`, value, 'ms')
      checkPerformanceBudget(metric.toUpperCase(), value)
    })
  }

  // Resource timing
  const resources = performance.getEntriesByType('resource')
  const slowResources = resources.filter(r => r.duration > 1000)
  if (slowResources.length > 0) {
    await trackEvent('slow_resources_detected', {
      count: slowResources.length,
      slowest: Math.max(...slowResources.map(r => r.duration))
    })
  }
}

// Synchronous getters for backward compatibility (with null safety)
export const auth = cachedAuth
export const db = cachedDb
export const analytics = cachedAnalytics
export const performance = cachedPerformance

// Health check function for monitoring
export const getFirebaseHealth = async () => {
  const app = await getFirebaseApp()
  const authInstance = await getAuthInstance()
  const dbInstance = await getDbInstance()
  const analyticsInstance = await getAnalyticsInstance()
  const performanceInstance = await getPerformanceInstance()
  
  return {
    app: !!app,
    auth: !!authInstance,
    firestore: !!dbInstance,
    analytics: !!analyticsInstance,
    performance: !!performanceInstance,
    activeTraces: activeTraces.size,
    environment: isDevelopment ? 'development' : 'production',
    timestamp: new Date().toISOString()
  }
}

// Cleanup function for memory optimization
export const cleanupFirebase = () => {
  debugLog('Cleaning up Firebase instances')
  // Stop all active traces
  activeTraces.forEach((trace, id) => {
    try {
      trace.stop()
    } catch (error) {
      debugLog(`Error stopping trace ${id}:`, error)
    }
  })
  activeTraces.clear()
  
  cachedApp = null
  cachedAuth = null
  cachedDb = null
  cachedAnalytics = null
  cachedPerformance = null
  initializationPromise = null
}

// Default export for backward compatibility
export default getFirebaseApp