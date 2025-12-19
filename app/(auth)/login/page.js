'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bike, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('¡Bienvenido de vuelta!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50">
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary to-blue-700 text-white p-4 rounded-2xl shadow-2xl shadow-primary/30"
            >
              <Bike className="w-12 h-12" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CyclingPRO</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <p className="text-slate-600">Gestión de Servicios de Ciclismo</p>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
        </div>

        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-base">Ingresa a tu cuenta de CyclingPRO</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-600 shadow-lg shadow-primary/30 transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-base">
              <span className="text-slate-600">¿No tienes cuenta? </span>
              <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}