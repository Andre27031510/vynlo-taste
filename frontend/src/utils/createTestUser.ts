import { getAuthInstance } from '@/config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const createTestUser = async () => {
  const auth = getAuthInstance()
  if (!auth) return

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@vynlotaste.com',
      'admin123456'
    )
    console.log('Usuário de teste criado:', userCredential.user.email)
    return userCredential.user
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
  }
}