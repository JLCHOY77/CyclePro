'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Bike, Calendar, Plus, LogOut, Wrench, Clock, CheckCircle, Loader2, Home, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createBooking } from '@/app/actions/booking-actions'
import { createBicycle } from '@/app/actions/bicycle-actions'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [bicycles, setBicycles] = useState([])
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bikeDialogOpen, setBikeDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Cargar bicicletas
      const bikeRes = await fetch('/api/bicycles')
      const bikeData = await bikeRes.json()
      setBicycles(bikeData.bicycles || [])

      // Cargar servicios
      const servRes = await fetch('/api/services')
      const servData = await servRes.json()
      setServices(servData.services || [])

      // Cargar bookings
      const bookRes = await fetch('/api/bookings')
      const bookData = await bookRes.json()
      setBookings(bookData.bookings || [])

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function handleCreateBooking(e) {
    e.preventDefault()
    const formData = {
      bicycleId: e.target.bicycleId.value,
      serviceId: e.target.serviceId.value,
      date: e.target.date.value,
      notes: e.target.notes.value
    }

    const result = await createBooking(formData)
    
    if (result.success) {
      toast.success(result.message)
      setDialogOpen(false)
      loadData()
    } else {
      toast.error(result.error)
    }
  }

  async function handleCreateBike(e) {
    e.preventDefault()
    const formData = {
      brand: e.target.brand.value,
      model: e.target.model.value,
      serialNumber: e.target.serialNumber.value,
      color: e.target.color.value,
      notes: e.target.notes.value
    }

    const result = await createBicycle(formData)
    
    if (result.success) {
      toast.success(result.message)
      setBikeDialogOpen(false)
      loadData()
    } else {
      toast.error(result.error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'IN_WORKSHOP': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'IN_WORKSHOP': return 'En Taller'
      case 'COMPLETED': return 'Completado'
      case 'CANCELLED': return 'Cancelado'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-primary/30">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CyclingPRO</h1>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  Inicio
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-2">
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Mis Bicicletas</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Bike className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{bicycles.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Citas Activas</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'PENDING' || b.status === 'IN_WORKSHOP').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Servicios Completados</CardTitle>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {bookings.filter(b => b.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mis Bicicletas */}
          <Card className="border-2 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Bike className="w-5 h-5 text-primary" />
                    Mis Bicicletas
                  </CardTitle>
                  <CardDescription>Gestiona tus bicicletas registradas</CardDescription>
                </div>
                <Dialog open={bikeDialogOpen} onOpenChange={setBikeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-600 shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>Registrar Bicicleta</DialogTitle>
                      <DialogDescription>Agrega una nueva bicicleta a tu cuenta</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBike} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Marca *</Label>
                        <Input id="brand" name="brand" placeholder="Trek, Giant, Specialized..." required className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Modelo *</Label>
                        <Input id="model" name="model" placeholder="Mountain X, Road Pro..." required className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Número de Serie (Opcional)</Label>
                        <Input id="serialNumber" name="serialNumber" placeholder="ABC123456" className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" name="color" placeholder="Rojo, Azul, Negro..." className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea id="notes" name="notes" placeholder="Cualquier detalle adicional..." className="border-2" />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-600">
                        Guardar Bicicleta
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {bicycles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bike className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No tienes bicicletas registradas</p>
                  <p className="text-sm text-slate-400 mt-1">Agrega tu primera bicicleta</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bicycles.map((bike) => (
                    <motion.div
                      key={bike.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-100 hover:border-primary/30 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Bike className="w-4 h-4 text-primary" />
                            <h4 className="font-bold text-slate-900">{bike.brand} {bike.model}</h4>
                          </div>
                          {bike.color && (
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></span>
                              Color: {bike.color}
                            </p>
                          )}
                          {bike.serialNumber && (
                            <p className="text-xs text-slate-500 mt-1">S/N: {bike.serialNumber}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nueva Cita */}
          <Card className="border-2 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Agendar Servicio
              </CardTitle>
              <CardDescription>Crea una nueva cita de mantenimiento</CardDescription>
            </CardHeader>
            <CardContent>
              {bicycles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bike className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="text-slate-500 font-medium">Primero debes registrar una bicicleta</p>
                  <p className="text-sm text-slate-400 mt-1">Usa el formulario de la izquierda</p>
                </div>
              ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full h-16 text-lg bg-gradient-to-r from-secondary to-emerald-600 hover:from-secondary/90 hover:to-emerald-500 shadow-xl shadow-secondary/30 transition-all duration-300">
                      <Calendar className="w-5 h-5 mr-2" />
                      Nueva Cita
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>Agendar Servicio</DialogTitle>
                      <DialogDescription>Selecciona los detalles de tu cita</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBooking} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bicycleId">Bicicleta *</Label>
                        <Select name="bicycleId" required>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Selecciona una bicicleta" />
                          </SelectTrigger>
                          <SelectContent>
                            {bicycles.map((bike) => (
                              <SelectItem key={bike.id} value={bike.id}>
                                {bike.brand} {bike.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceId">Servicio *</Label>
                        <Select name="serviceId" required>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Selecciona un servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.filter(s => s.isActive).map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - ${service.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha y Hora *</Label>
                        <Input 
                          id="date" 
                          name="date" 
                          type="datetime-local" 
                          required 
                          min={new Date().toISOString().slice(0, 16)}
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas (Opcional)</Label>
                        <Textarea id="notes" name="notes" placeholder="Describe el problema o solicitud..." className="border-2" />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-600">
                        Crear Cita
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mis Citas */}
        <Card className="mt-6 border-2 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Mis Citas
            </CardTitle>
            <CardDescription>Historial de servicios y citas</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No tienes citas registradas</p>
                <p className="text-sm text-slate-400 mt-1">Agenda tu primer servicio</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-100 hover:border-primary/30 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-primary/10 p-1.5 rounded-lg">
                            <Wrench className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-bold text-slate-900">{booking.service?.name}</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                          <Bike className="w-3.5 h-3.5" />
                          {booking.bicycle?.brand} {booking.bicycle?.model}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(booking.date).toLocaleString('es-PA', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-slate-600 mt-3 pl-6 italic">{booking.notes}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
