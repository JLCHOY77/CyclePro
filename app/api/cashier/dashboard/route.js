import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar rol
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || (dbUser.role !== 'CASHIER' && dbUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener fecha de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Citas de hoy
    const todayBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        user: true,
        bicycle: true,
        service: true
      },
      orderBy: { date: 'asc' }
    })

    // Todas las citas (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true,
        bicycle: true,
        service: true
      },
      orderBy: { date: 'desc' }
    })

    // Estadísticas
    const stats = {
      today: todayBookings.length,
      pending: todayBookings.filter(b => b.status === 'PENDING').length,
      completed: todayBookings.filter(b => b.status === 'COMPLETED').length,
      revenue: todayBookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.service?.price || 0), 0)
    }

    return NextResponse.json({
      bookings,
      todayBookings,
      stats
    })
  } catch (error) {
    console.error('Error in cashier dashboard:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}