import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}