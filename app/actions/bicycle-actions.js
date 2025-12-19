'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBicycle(formData) {
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

    const bicycle = await prisma.bicycle.create({
      data: {
        userId: dbUser.id,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber || null,
        color: formData.color || null,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
        notes: formData.notes || null
      }
    })

    revalidatePath('/bicycles')
    revalidatePath('/dashboard')

    return {
      success: true,
      bicycle,
      message: '✅ Bicicleta registrada'
    }

  } catch (error) {
    console.error('Error al crear bicicleta:', error)
    return {
      success: false,
      error: error.message || 'Error al registrar la bicicleta'
    }
  }
}

export async function updateBicycle(bicycleId, formData) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const bicycle = await prisma.bicycle.findFirst({
      where: {
        id: bicycleId,
        userId: user.id
      }
    })

    if (!bicycle) {
      return { success: false, error: 'Bicicleta no encontrada' }
    }

    const updated = await prisma.bicycle.update({
      where: { id: bicycleId },
      data: {
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber || null,
        color: formData.color || null,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
        notes: formData.notes || null
      }
    })

    revalidatePath('/bicycles')
    revalidatePath('/dashboard')

    return {
      success: true,
      bicycle: updated,
      message: '✅ Bicicleta actualizada'
    }

  } catch (error) {
    console.error('Error al actualizar bicicleta:', error)
    return {
      success: false,
      error: error.message || 'Error al actualizar la bicicleta'
    }
  }
}

export async function deleteBicycle(bicycleId) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const bicycle = await prisma.bicycle.findFirst({
      where: {
        id: bicycleId,
        userId: user.id
      }
    })

    if (!bicycle) {
      return { success: false, error: 'Bicicleta no encontrada' }
    }

    await prisma.bicycle.delete({
      where: { id: bicycleId }
    })

    revalidatePath('/bicycles')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: '✅ Bicicleta eliminada'
    }

  } catch (error) {
    console.error('Error al eliminar bicicleta:', error)
    return {
      success: false,
      error: error.message || 'Error al eliminar la bicicleta'
    }
  }
}