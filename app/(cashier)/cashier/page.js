'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, DollarSign, Clock, Users, Bike, Home, LogOut, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CashierDashboard() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [todayBookings, setTodayBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ today: 0, pending: 0, completed: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    // Verificar rol
    const res = await fetch('/api/users/me')
    const userData = await res.json()
    
    if (userData.user?.role !== 'CASHIER' && userData.user?.role !== 'ADMIN') {
      toast.error('No tienes permisos de cajero')
      router.push('/dashboard')
      return
    }
    
    setUser(userData.user)
  }

  async function loadData() {
    try {
      const res = await fetch('/api/cashier/dashboard')
      const data = await res.json()
      
      setBookings(data.bookings || [])
      setTodayBookings(data.todayBookings || [])
      setStats(data.stats || { today: 0, pending: 0, completed: 0, revenue: 0 })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredBookings = bookings.filter(b => 
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bicycle?.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'IN_WORKSHOP': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2.5 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Cajero - CyclingPRO</h1>
                <p className="text-sm text-slate-600">{user?.name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Citas Hoy</CardTitle>
              <Calendar className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.today}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pendientes</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completadas</CardTitle>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Ingresos Hoy</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${stats.revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por cliente, email o bicicleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="today">Citas de Hoy ({todayBookings.length})</TabsTrigger>
            <TabsTrigger value="all">Todas las Citas ({filteredBookings.length})</TabsTrigger>
          </TabsList>

          {/* Today's Bookings */}
          <TabsContent value="today" className="space-y-4">
            {todayBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">No hay citas para hoy</p>
                </CardContent>
              </Card>
            ) : (
              todayBookings.map(booking => (
                <Card key={booking.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold text-slate-900">{booking.user?.name || 'Cliente'}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status === 'PENDING' ? 'Pendiente' : 
                             booking.status === 'IN_WORKSHOP' ? 'En Taller' :
                             booking.status === 'COMPLETED' ? 'Completado' : booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{booking.user?.email}</p>
                        <p className="text-sm text-slate-600 mb-1">Tel: {booking.user?.phone || 'No registrado'}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Servicio</p>
                        <p className="font-semibold text-slate-900">{booking.service?.name}</p>
                        <p className="text-sm text-emerald-600 font-medium">${booking.service?.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Bicicleta</p>
                        <div className="flex items-center gap-2">
                          <Bike className="w-4 h-4 text-slate-400" />
                          <p className="font-semibold text-slate-900">
                            {booking.bicycle?.brand} {booking.bicycle?.model}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Hora</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(booking.date).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Duración</p>
                        <p className="font-semibold text-slate-900">{booking.service?.duration} min</p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 mb-1">Notas:</p>
                        <p className="text-sm text-blue-900">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link href={`/cashier/booking/${booking.id}`} className="flex-1">
                        <Button className="w-full" variant="default">
                          Gestionar Cita
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* All Bookings */}
          <TabsContent value="all" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">No se encontraron citas</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.slice(0, 20).map(booking => (
                <Card key={booking.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{booking.user?.name || 'Cliente'}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status === 'PENDING' ? 'Pendiente' : 
                             booking.status === 'IN_WORKSHOP' ? 'En Taller' :
                             booking.status === 'COMPLETED' ? 'Completado' : booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {new Date(booking.date).toLocaleDateString('es-PA', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {booking.service?.name} - {booking.bicycle?.brand} {booking.bicycle?.model}
                        </p>
                      </div>
                      <Link href={`/cashier/booking/${booking.id}`}>
                        <Button size="sm" variant="outline">Ver Detalles</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}