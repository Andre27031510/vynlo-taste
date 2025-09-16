'use client'

import { useState } from 'react'

export const useAppointmentModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    openModal,
    closeModal
  }
}
