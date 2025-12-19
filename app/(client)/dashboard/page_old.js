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
import { Bike, Calendar, Plus, LogOut, Wrench, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createBooking } from '@/app/actions/booking-actions'
import { createBicycle } from '@/app/actions/bicycle-actions'

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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_WORKSHOP': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CyclingPRO</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Mis Bicicletas</CardTitle>
                <Bike className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bicycles.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Citas Activas</CardTitle>
                <Calendar className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'PENDING' || b.status === 'IN_WORKSHOP').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Servicios Completados</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mis Bicicletas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mis Bicicletas</CardTitle>
                  <CardDescription>Gestiona tus bicicletas registradas</CardDescription>
                </div>
                <Dialog open={bikeDialogOpen} onOpenChange={setBikeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Bicicleta</DialogTitle>
                      <DialogDescription>Agrega una nueva bicicleta a tu cuenta</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBike} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Marca</Label>
                        <Input id="brand" name="brand" placeholder="Trek, Giant, etc." required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Modelo</Label>
                        <Input id="model" name="model" placeholder="Mountain X, Road Pro" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Número de Serie (Opcional)</Label>
                        <Input id="serialNumber" name="serialNumber" placeholder="ABC123456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" name="color" placeholder="Rojo, Azul, Negro" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea id="notes" name="notes" placeholder="Cualquier detalle adicional..." />
                      </div>
                      <Button type="submit" className="w-full">Guardar Bicicleta</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {bicycles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bike className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No tienes bicicletas registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bicycles.map((bike) => (
                    <div key={bike.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{bike.brand} {bike.model}</h4>
                          {bike.color && <p className="text-sm text-gray-600">Color: {bike.color}</p>}
                          {bike.serialNumber && <p className="text-xs text-gray-500 mt-1">S/N: {bike.serialNumber}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nueva Cita */}
          <Card>
            <CardHeader>
              <CardTitle>Agendar Servicio</CardTitle>
              <CardDescription>Crea una nueva cita de mantenimiento</CardDescription>
            </CardHeader>
            <CardContent>
              {bicycles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bike className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Primero debes registrar una bicicleta</p>
                </div>
              ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Nueva Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agendar Servicio</DialogTitle>
                      <DialogDescription>Selecciona los detalles de tu cita</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBooking} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bicycleId">Bicicleta</Label>
                        <Select name="bicycleId" required>
                          <SelectTrigger>
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
                        <Label htmlFor="serviceId">Servicio</Label>
                        <Select name="serviceId" required>
                          <SelectTrigger>
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
                        <Label htmlFor="date">Fecha y Hora</Label>
                        <Input 
                          id="date" 
                          name="date" 
                          type="datetime-local" 
                          required 
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas (Opcional)</Label>
                        <Textarea id="notes" name="notes" placeholder="Describe el problema o solicitud..." />
                      </div>
                      <Button type="submit" className="w-full">Crear Cita</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mis Citas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mis Citas</CardTitle>
            <CardDescription>Historial de servicios y citas</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No tienes citas registradas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-gray-900">{booking.service?.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {booking.bicycle?.brand} {booking.bicycle?.model}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(booking.date).toLocaleString('es-PA')}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-600 mt-2 pl-6">{booking.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}