'use client'

import { Button } from '@/components/ui/button'
import { Bike, Calendar, Wrench, CreditCard, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Reserva en Línea',
      description: 'Agenda tus servicios de mantenimiento de forma rápida y sencilla desde tu celular.'
    },
    {
      icon: Wrench,
      title: 'Servicios Profesionales',
      description: 'Mecánicos certificados y especializados en todo tipo de bicicletas.'
    },
    {
      icon: CreditCard,
      title: 'Pago con Yappy',
      description: 'Paga fácilmente con Yappy, tarjeta o efectivo. ¡Tú eliges!'
    },
    {
      icon: Clock,
      title: 'Seguimiento en Tiempo Real',
      description: 'Recibe notificaciones sobre el estado de tu servicio en todo momento.'
    },
    {
      icon: Shield,
      title: 'Garantía de Calidad',
      description: 'Todos nuestros servicios incluyen garantía y repuestos originales.'
    },
    {
      icon: Bike,
      title: 'Historial de Servicios',
      description: 'Mantén el registro completo del mantenimiento de todas tus bicicletas.'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-70" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Bike className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a <span className="text-primary">CyclingPRO</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              La plataforma líder de gestión de servicios de ciclismo en Panamá
            </p>
            <p className="text-lg text-gray-500 mb-10">
              Agenda, gestiona y paga tus servicios de mantenimiento desde tu celular. Fácil, rápido y seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Comenzar Ahora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-lg text-gray-600">
              Gestión completa de servicios de ciclismo optimizada para Panamá
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Únete a cientos de ciclistas en Panamá que confian en CyclingPRO
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Crear Cuenta Gratis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bike className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold">CyclingPRO</span>
          </div>
          <p className="text-gray-400">
            © 2025 CyclingPRO Panama. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}