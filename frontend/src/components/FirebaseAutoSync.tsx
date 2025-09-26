'use client'

import { useFirebaseAutoSync } from '@/hooks/useFirebaseAutoSync'

export default function FirebaseAutoSync() {
  useFirebaseAutoSync()
  return null // Componente invisível que apenas executa a sincronização
}