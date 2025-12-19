import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const bicycles = await prisma.bicycle.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ bicycles })
  } catch (error) {
    console.error('Error fetching bicycles:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()

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

    const bicycle = await prisma.bicycle.create({
      data: {
        userId: dbUser.id,
        brand: body.brand,
        model: body.model,
        serialNumber: body.serialNumber || null,
        color: body.color || null,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        notes: body.notes || null
      }
    })

    return NextResponse.json({ bicycle })
  } catch (error) {
    console.error('Error creating bicycle:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}