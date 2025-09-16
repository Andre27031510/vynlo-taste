// Serviço de Newsletter e Agendamento
interface NewsletterData {
  email: string
  timestamp: string
  source: string
}

interface AppointmentData {
  name: string
  email: string
  phone: string
  company: string
  segment: string
  date: string
  time: string
  type: 'demo' | 'consultation' | 'presentation'
  message?: string
}

class NewsletterService {
  private storageKey = 'vynlo_newsletter_subscribers'
  private appointmentsKey = 'vynlo_appointments'

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, message: 'Email inválido' }
      }

      // Verificar se já está inscrito
      const subscribers = this.getSubscribers()
      if (subscribers.some(sub => sub.email === email)) {
        return { success: false, message: 'Email já cadastrado' }
      }

      // Adicionar subscriber
      const newSubscriber: NewsletterData = {
        email,
        timestamp: new Date().toISOString(),
        source: 'blog'
      }

      subscribers.push(newSubscriber)
      localStorage.setItem(this.storageKey, JSON.stringify(subscribers))

      // Simular envio para serviço real (Mailchimp/SendGrid)
      await this.sendToEmailService(newSubscriber)

      console.log('📧 Newsletter: Novo subscriber:', email)
      return { success: true, message: 'Inscrição realizada com sucesso!' }

    } catch (error) {
      console.error('Erro ao inscrever newsletter:', error)
      return { success: false, message: 'Erro interno. Tente novamente.' }
    }
  }

  // Agendamento
  async scheduleAppointment(data: AppointmentData): Promise<{ success: boolean; message: string }> {
    try {
      // Validar dados
      const validation = this.validateAppointmentData(data)
      if (!validation.valid) {
        return { success: false, message: validation.message }
      }

      // Verificar disponibilidade
      const isAvailable = this.checkAvailability(data.date, data.time)
      if (!isAvailable) {
        return { success: false, message: 'Horário não disponível' }
      }

      // Salvar agendamento
      const appointments = this.getAppointments()
      const newAppointment = {
        ...data,
        id: this.generateId(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }

      appointments.push(newAppointment)
      localStorage.setItem(this.appointmentsKey, JSON.stringify(appointments))

      // Enviar confirmações
      await this.sendConfirmationEmail(newAppointment)
      await this.notifyTeam(newAppointment)

      console.log('📅 Agendamento confirmado:', data.name, data.date, data.time)
      return { success: true, message: 'Agendamento confirmado! Você receberá um email de confirmação.' }

    } catch (error) {
      console.error('Erro ao agendar:', error)
      return { success: false, message: 'Erro ao agendar. Tente novamente.' }
    }
  }

  // Verificar disponibilidade
  checkAvailability(date: string, time: string): boolean {
    const appointments = this.getAppointments()
    const dateTime = `${date} ${time}`
    
    // Verificar se já existe agendamento no mesmo horário
    const conflict = appointments.some(apt => 
      `${apt.date} ${apt.time}` === dateTime && apt.status === 'confirmed'
    )

    // Verificar horário comercial
    const [hour] = time.split(':').map(Number)
    const isBusinessHour = hour >= 9 && hour <= 18

    // Verificar dia da semana
    const dayOfWeek = new Date(date).getDay()
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5

    return !conflict && isBusinessHour && isWeekday
  }

  // Obter horários disponíveis
  getAvailableSlots(date: string): string[] {
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ]

    return slots.filter(time => this.checkAvailability(date, time))
  }

  // Métodos privados
  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  private getSubscribers(): NewsletterData[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private getAppointments(): any[] {
    try {
      const stored = localStorage.getItem(this.appointmentsKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private validateAppointmentData(data: AppointmentData): { valid: boolean; message: string } {
    if (!data.name.trim()) return { valid: false, message: 'Nome é obrigatório' }
    if (!this.isValidEmail(data.email)) return { valid: false, message: 'Email inválido' }
    if (!data.phone.trim()) return { valid: false, message: 'Telefone é obrigatório' }
    if (!data.company.trim()) return { valid: false, message: 'Empresa é obrigatória' }
    if (!data.date) return { valid: false, message: 'Data é obrigatória' }
    if (!data.time) return { valid: false, message: 'Horário é obrigatório' }
    
    return { valid: true, message: '' }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async sendToEmailService(subscriber: NewsletterData): Promise<void> {
    // Simular integração com Mailchimp/SendGrid
    console.log('📧 Enviando para serviço de email:', subscriber.email)
    
    // Em produção, aqui seria a integração real:
    // await fetch('/api/newsletter/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscriber)
    // })
  }

  private async sendConfirmationEmail(appointment: any): Promise<void> {
    console.log('📧 Email de confirmação enviado para:', appointment.email)
    
    // Em produção, integração com serviço de email
  }

  private async notifyTeam(appointment: any): Promise<void> {
    console.log('🔔 Equipe notificada sobre agendamento:', appointment.name)
    
    // Em produção, notificação via Slack/Teams/WhatsApp
  }

  // Estatísticas
  getStats() {
    const subscribers = this.getSubscribers()
    const appointments = this.getAppointments()
    
    return {
      totalSubscribers: subscribers.length,
      totalAppointments: appointments.length,
      recentSubscribers: subscribers.filter(sub => 
        new Date(sub.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      confirmedAppointments: appointments.filter(apt => apt.status === 'confirmed').length
    }
  }
}

export const newsletterService = new NewsletterService()
export type { NewsletterData, AppointmentData }