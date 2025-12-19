'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/lib/services/calendar-service'
import { sendBookingConfirmation, sendBookingStatusUpdate } from '@/lib/services/email-service'
import { revalidatePath } from 'next/cache'

/**
 * Server Action para crear una cita
 * - Guarda en Supabase vía Prisma
 * - Sincroniza con Google Calendar (Mocked)
 * - Envía email de confirmación (Mocked)
 */
export async function createBooking(formData) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Buscar o crear usuario en la BD
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          phone: user.user_metadata?.phone,
          role: 'CLIENT'
        }
      })
    }

    // Validar que la bicicleta pertenece al usuario
    const bicycle = await prisma.bicycle.findFirst({
      where: {
        id: formData.bicycleId,
        userId: dbUser.id
      }
    })

    if (!bicycle) {
      return { success: false, error: 'Bicicleta no encontrada' }
    }

    // Obtener servicio
    const service = await prisma.service.findUnique({
      where: { id: formData.serviceId }
    })

    if (!service || !service.isActive) {
      return { success: false, error: 'Servicio no disponible' }
    }

    // Crear booking
    const booking = await prisma.booking.create({
      data: {
        userId: dbUser.id,
        bicycleId: formData.bicycleId,
        serviceId: formData.serviceId,
        date: new Date(formData.date),
        notes: formData.notes || null,
        status: 'PENDING'
      },
      include: {
        user: true,
        bicycle: true,
        service: true
      }
    })

    // 1. Sincronizar con Google Calendar (Mocked)
    const calendarResult = await createCalendarEvent(booking, dbUser, bicycle, service)
    
    if (calendarResult.success) {
      // Actualizar booking con el ID del evento de Google
      await prisma.booking.update({
        where: { id: booking.id },
        data: { googleEventId: calendarResult.eventId }
      })
    }

    // 2. Enviar email de confirmación (Mocked)
    await sendBookingConfirmation(booking, dbUser, bicycle, service)

    revalidatePath('/dashboard')
    revalidatePath('/bookings')

    return {
      success: true,
      booking: {
        id: booking.id,
        date: booking.date.toISOString(),
        status: booking.status,
        service: service.name
      },
      message: '✅ Cita creada exitosamente'
    }

  } catch (error) {
    console.error('Error al crear booking:', error)
    return {
      success: false,
      error: error.message || 'Error al crear la cita'
    }
  }
}

export async function updateBookingStatus(bookingId, newStatus) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        service: true,
        bicycle: true
      }
    })

    if (!booking) {
      return { success: false, error: 'Cita no encontrada' }
    }

    // Actualizar en BD
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    })

    // Actualizar en Google Calendar si existe el evento
    if (booking.googleEventId) {
      await updateCalendarEvent(booking.googleEventId, {
        description: `Estado: ${newStatus}`
      })
    }

    // Enviar email de actualización
    await sendBookingStatusUpdate(booking, booking.user, newStatus)

    revalidatePath('/dashboard')
    revalidatePath('/bookings')
    revalidatePath('/admin')

    return {
      success: true,
      message: `✅ Estado actualizado a ${newStatus}`
    }

  } catch (error) {
    console.error('Error al actualizar booking:', error)
    return {
      success: false,
      error: error.message || 'Error al actualizar la cita'
    }
  }
}

export async function cancelBooking(bookingId) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true }
    })

    if (!booking) {
      return { success: false, error: 'Cita no encontrada' }
    }

    // Verificar que el usuario puede cancelar (owner o admin)
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (booking.userId !== user.id && dbUser?.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    // Actualizar estado
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    })

    // Eliminar de Google Calendar
    if (booking.googleEventId) {
      await deleteCalendarEvent(booking.googleEventId)
    }

    revalidatePath('/dashboard')
    revalidatePath('/bookings')

    return {
      success: true,
      message: '✅ Cita cancelada'
    }

  } catch (error) {
    console.error('Error al cancelar booking:', error)
    return {
      success: false,
      error: error.message || 'Error al cancelar la cita'
    }
  }
}