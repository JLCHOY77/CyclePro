import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        bicycle: true,
        service: true
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}