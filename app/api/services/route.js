import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: parseFloat(body.price),
        duration: parseInt(body.duration),
        isActive: body.isActive !== false
      }
    })

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}