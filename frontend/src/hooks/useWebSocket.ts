import { useEffect, useRef, useCallback } from 'react'
import { wsService } from '../services/websocket'

export const useWebSocket = () => {
  const isConnected = useRef(false)

  const connect = useCallback(async () => {
    if (!isConnected.current) {
      try {
        await wsService.connect()
        isConnected.current = true
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    if (isConnected.current) {
      wsService.disconnect()
      isConnected.current = false
    }
  }, [])

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    return wsService.subscribe(eventType, callback)
  }, [])

  const send = useCallback((type: string, payload: any) => {
    wsService.send(type, payload)
  }, [])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    connect,
    disconnect,
    subscribe,
    send,
    isConnected: () => wsService.isConnected()
  }
}