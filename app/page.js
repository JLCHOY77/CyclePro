'use client'

import { Button } from '@/components/ui/button'
import { Bike, Calendar, Wrench, CreditCard, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogoIcon } from '@/components/LogoIcon'

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Reserva en Línea',
      description: 'Agenda tus servicios de mantenimiento de forma rápida y sencilla desde tu celular.',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      icon: Wrench,
      title: 'Servicios Profesionales',
      description: 'Mecánicos certificados y especializados en todo tipo de bicicletas.',
      gradient: 'from-primary to-blue-800'
    },
    {
      icon: CreditCard,
      title: 'Pago Fácil',
      description: 'Paga fácilmente con Yappy, tarjeta o efectivo. ¡Tú eliges!',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    {
      icon: Clock,
      title: 'Seguimiento en Tiempo Real',
      description: 'Recibe notificaciones sobre el estado de tu servicio en todo momento.',
      gradient: 'from-amber-500 to-amber-700'
    },
    {
      icon: Shield,
      title: 'Garantía de Calidad',
      description: 'Todos nuestros servicios incluyen garantía y repuestos originales.',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      icon: Bike,
      title: 'Historial de Servicios',
      description: 'Mantén el registro completo del mantenimiento de todas tus bicicletas.',
      gradient: 'from-rose-500 to-rose-700'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section con fondo oscuro profesional para logo */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-emerald-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <LogoIcon className="w-56 h-56" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
              <span className="text-white drop-shadow-lg">Bienvenido a </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500">CyclingPRO</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <p className="text-xl md:text-2xl text-white font-medium drop-shadow-lg">
                La plataforma líder de gestión de servicios de ciclismo en Panamá
              </p>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            
            <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
              Agenda, gestiona y paga tus servicios de mantenimiento desde tu celular. Fácil, rápido y seguro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-2 border-yellow-400/50 text-white hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-2 border-yellow-400/50 text-white hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section con fondo claro */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="text-xl text-slate-600">
                Gestión completa de servicios de ciclismo optimizada para Panamá
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-primary to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Únete a cientos de ciclistas en Panamá que confían en CyclingPRO
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 h-14 bg-white text-primary hover:bg-slate-100 shadow-2xl transition-all duration-300 hover:scale-105">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <LogoIcon className="w-20 h-20" />
          </div>
          <p className="text-slate-400 text-lg">
            © 2025 CyclingPRO Panama. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
