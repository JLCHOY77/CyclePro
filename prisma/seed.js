const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crear servicios de ejemplo
  const services = [
    {
      name: 'Mantenimiento Básico',
      description: 'Ajuste de frenos, cambios y lubricación de cadena',
      price: 25.00,
      duration: 60,
      isActive: true
    },
    {
      name: 'Mantenimiento Completo',
      description: 'Mantenimiento completo incluyendo revisión de componentes',
      price: 50.00,
      duration: 120,
      isActive: true
    },
    {
      name: 'Reparación de Llanta',
      description: 'Cambio de llanta o reparación de pinchazo',
      price: 15.00,
      duration: 30,
      isActive: true
    },
    {
      name: 'Ajuste de Frenos',
      description: 'Ajuste y calibración de sistema de frenos',
      price: 20.00,
      duration: 45,
      isActive: true
    },
    {
      name: 'Cambio de Cadena',
      description: 'Reemplazo de cadena desgastada',
      price: 35.00,
      duration: 45,
      isActive: true
    },
    {
      name: 'Limpieza Profunda',
      description: 'Limpieza completa y detallada de la bicicleta',
      price: 30.00,
      duration: 90,
      isActive: true
    },
    {
      name: 'Ajuste de Cambios',
      description: 'Calibración del sistema de transmisión',
      price: 20.00,
      duration: 40,
      isActive: true
    },
    {
      name: 'Revisión General',
      description: 'Inspección completa de todos los componentes',
      price: 15.00,
      duration: 30,
      isActive: true
    }
  ]

  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    })
    console.log(`✅ Created/Updated service: ${created.name}`)
  }

  // Crear un usuario admin de ejemplo (opcional)
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@cyclingpro.com' },
      update: { role: 'ADMIN' },
      create: {
        id: 'admin-uuid-123', // Este ID debe coincidir con un usuario real de Supabase Auth
        email: 'admin@cyclingpro.com',
        name: 'Administrador',
        phone: '6000-0000',
        role: 'ADMIN'
      }
    })
    console.log(`✅ Created/Updated admin user: ${adminUser.email}`)
  } catch (error) {
    console.log('⚠️  Nota: Para crear un usuario admin, primero regístralo en Supabase Auth')
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
