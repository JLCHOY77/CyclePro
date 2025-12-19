// Email Service - Mocked (Nodemailer)
// Simulación de envío de emails

export async function sendBookingConfirmation(booking, user, bicycle, service) {
  console.log('📧 [MOCKED] Enviando email de confirmación...')
  console.log('Para:', user.email)
  console.log('Asunto: Confirmación de cita - CyclingPRO')
  console.log('Contenido:', {
    userName: user.name,
    serviceName: service.name,
    bicycleModel: `${bicycle.brand} ${bicycle.model}`,
    date: booking.date,
    price: service.price
  })
  
  // Simulación de delay de envío
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
    message: '✅ Email enviado exitosamente (MOCK)'
  }
}

export async function sendBookingStatusUpdate(booking, user, newStatus) {
  console.log('📧 [MOCKED] Enviando actualización de estado...')
  console.log('Para:', user.email)
  console.log('Nuevo estado:', newStatus)
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
    message: '✅ Email de actualización enviado (MOCK)'
  }
}