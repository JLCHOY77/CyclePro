'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createService(formData) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Verificar que es admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    const service = await prisma.service.create({
      data: {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        isActive: formData.isActive !== false
      }
    })

    revalidatePath('/admin/services')
    revalidatePath('/dashboard')

    return {
      success: true,
      service,
      message: '✅ Servicio creado'
    }

  } catch (error) {
    console.error('Error al crear servicio:', error)
    return {
      success: false,
      error: error.message || 'Error al crear el servicio'
    }
  }
}

export async function updateService(serviceId, formData) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Verificar que es admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        isActive: formData.isActive
      }
    })

    revalidatePath('/admin/services')
    revalidatePath('/dashboard')

    return {
      success: true,
      service,
      message: '✅ Servicio actualizado'
    }

  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    return {
      success: false,
      error: error.message || 'Error al actualizar el servicio'
    }
  }
}

export async function toggleServiceStatus(serviceId) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Verificar que es admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' }
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return { success: false, error: 'Servicio no encontrado' }
    }

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: !service.isActive }
    })

    revalidatePath('/admin/services')

    return {
      success: true,
      service: updated,
      message: `✅ Servicio ${updated.isActive ? 'activado' : 'desactivado'}`
    }

  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error)
    return {
      success: false,
      error: error.message || 'Error al cambiar estado del servicio'
    }
  }
}