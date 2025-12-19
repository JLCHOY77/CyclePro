'use client'

import { Button } from '@/components/ui/button'
import { Bike, Calendar, Wrench, CreditCard, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
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
              className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-8 shadow-2xl shadow-primary/20"
            >
              <Bike className="w-16 h-16 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent mb-6">
              Bienvenido a CyclingPRO
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-secondary" />
              <p className="text-xl md:text-2xl text-slate-700 font-medium">
                La plataforma líder de gestión de servicios de ciclismo en Panamá
              </p>
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Agenda, gestiona y paga tus servicios de mantenimiento desde tu celular. Fácil, rápido y seguro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-600 shadow-xl shadow-primary/30 transition-all duration-300">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-2 border-primary hover:bg-primary/5 transition-all duration-300">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
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
                <div className="bg-gradient-to-br from-primary to-blue-700 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                  <feature.icon className="w-7 h-7 text-white" />
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
      <section className="py-24 bg-gradient-to-br from-primary via-blue-700 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
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
              <Button size="lg" variant="secondary" className="text-lg px-10 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-105">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl mr-3">
              <Bike className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold">CyclingPRO</span>
          </div>
          <p className="text-slate-400 text-lg">
            © 2025 CyclingPRO Panama. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}