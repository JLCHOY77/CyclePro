// Google Calendar Service - Mocked
// Simulación de sincronización con Google Calendar

export async function createCalendarEvent(booking, user, bicycle, service) {
  console.log('📅 [MOCKED] Creando evento en Google Calendar...')
  console.log('Detalles del evento:', {
    summary: `${service.name} - ${user.name}`,
    description: `Bicicleta: ${bicycle.brand} ${bicycle.model}`,
    start: booking.date,
    duration: service.duration
  })
  
  // Simulación de delay de API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockEventId = `mock-event-${Date.now()}`
  
  return {
    success: true,
    eventId: mockEventId,
    htmlLink: `https://calendar.google.com/calendar/event?eid=${mockEventId}`,
    message: '✅ Evento creado en Google Calendar (MOCK)'
  }
}

export async function updateCalendarEvent(eventId, updates) {
  console.log('📅 [MOCKED] Actualizando evento en Google Calendar...')
  console.log('Event ID:', eventId)
  console.log('Actualizaciones:', updates)
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: '✅ Evento actualizado en Google Calendar (MOCK)'
  }
}

export async function deleteCalendarEvent(eventId) {
  console.log('📅 [MOCKED] Eliminando evento de Google Calendar...')
  console.log('Event ID:', eventId)
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: '✅ Evento eliminado de Google Calendar (MOCK)'
  }
}