# CyclingPRO - SaaS de Gestión de Servicios de Ciclismo

## 🚴‍♂️ Descripción

CyclingPRO es una plataforma SaaS completa para la gestión de servicios de mantenimiento de bicicletas, optimizada para el mercado panameño.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes + Supabase
- **Base de Datos**: Supabase PostgreSQL gestionado con Prisma ORM
- **Autenticación**: Supabase Auth integrado con middleware de Next.js
- **Pagos**: Paguelo Facil (Yappy y tarjetas locales) - MOCKED
- **Notificaciones**: Google Calendar API y Nodemailer - MOCKED

## 📋 Características Implementadas

### ✅ Autenticación
- Login y Registro con Supabase Auth
- Middleware de protección de rutas
- Gestión de sesiones

### ✅ Gestión de Bicicletas
- Registro de bicicletas (marca, modelo, serial, color)
- Listado de bicicletas del usuario
- CRUD completo

### ✅ Sistema de Citas (Bookings)
- Catálogo de servicios
- Crear citas con fecha/hora
- Estados: Pendiente, En Taller, Completado, Cancelado
- Historial de servicios

### ✅ Server Actions
- `createBooking`: Crea cita + sincroniza Google Calendar + envía email
- `updateBookingStatus`: Actualiza estado de la cita
- `cancelBooking`: Cancela cita y elimina de calendario
- `createBicycle`, `updateBicycle`, `deleteBicycle`: CRUD de bicicletas
- `createService`, `updateService`, `toggleServiceStatus`: CRUD de servicios

### ✅ Dashboard Cliente (PWA Ready)
- Vista mobile-first con Shadcn/UI
- Animaciones con Framer Motion
- Gestión de bicicletas y citas
- Estadísticas personales

### 🔄 Integraciones Mockeadas
- **Google Calendar API**: Simulación de sincronización de eventos
- **Nodemailer**: Simulación de envío de emails
- **Paguelo Facil**: Simulación de pagos con Yappy

## 🗄️ Estructura de Base de Datos

### Modelos Prisma:
- **User**: Usuario vinculado a Supabase Auth UUID
- **Bicycle**: Bicicletas del cliente
- **Service**: Catálogo de servicios de mantenimiento
- **Booking**: Citas con estados y referencias a Google Calendar
- **Transaction**: Log de transacciones de pago con Paguelo Facil

## 🚀 Configuración Inicial

### 1. Configurar DATABASE_URL

Necesitas obtener la contraseña de tu base de datos PostgreSQL de Supabase:

1. Ve a tu proyecto: https://supabase.com/dashboard/project/lqsirpeqijpnrsmhypvd
2. Settings → Database
3. Busca "Connection string" o "Connection pooling" (Recommended)
4. Copia el connection string completo que se ve así:
   ```
   postgresql://postgres.lqsirpeqijpnrsmhypvd:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
5. Actualiza el `DATABASE_URL` en `/app/.env`

### 2. Ejecutar Migraciones de Prisma

```bash
cd /app

# Generar el cliente de Prisma
yarn prisma generate

# Crear las tablas en Supabase (opción 1: push directo)
yarn prisma db push

# O crear migración formal (opción 2: recomendado para producción)
yarn prisma migrate dev --name init
```

### 3. Hacer Seed de Datos

```bash
# Poblar la base de datos con servicios de ejemplo
node prisma/seed.js
```

### 4. Reiniciar el Servidor

```bash
sudo supervisorctl restart nextjs
```

## 📱 Estructura de Carpetas

```
/app
├── app/
│   ├── (auth)/           # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (client)/         # Dashboard cliente (PWA)
│   │   └── dashboard/
│   ├── (admin)/          # Dashboard admin (Desktop) - TODO
│   ├── api/              # API Routes
│   │   ├── bicycles/
│   │   ├── services/
│   │   └── bookings/
│   ├── actions/          # Server Actions
│   │   ├── booking-actions.js
│   │   ├── bicycle-actions.js
│   │   └── service-actions.js
│   ├── layout.js
│   ├── page.js           # Landing page
│   └── globals.css
├── components/ui/        # Shadcn/UI components
├── lib/
│   ├── prisma.js         # Prisma client
│   ├── supabase/         # Supabase clients
│   │   ├── client.js     # Client-side
│   │   ├── server.js     # Server-side
│   │   └── middleware.js # Auth middleware
│   └── services/         # Servicios externos (mocked)
│       ├── email-service.js
│       ├── calendar-service.js
│       └── payment-service.js
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   └── seed.js           # Seed data
├── middleware.js         # Next.js middleware (protección de rutas)
└── .env                  # Variables de entorno
```

## 🔐 Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lqsirpeqijpnrsmhypvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Database (IMPORTANTE: Actualizar con tu password)
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.lqsirpeqijpnrsmhypvd.supabase.co:5432/postgres

# Integraciones Mockeadas
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mock@cyclingpro.com
SMTP_PASS=mock-password

GOOGLE_CLIENT_ID=mock-client-id
GOOGLE_CLIENT_SECRET=mock-client-secret
GOOGLE_REFRESH_TOKEN=mock-refresh-token

PAGUELO_FACIL_API_KEY=mock-api-key
PAGUELO_FACIL_SECRET=mock-secret
```

## 🎯 Próximos Pasos

### Inmediatos:
1. ✅ Obtener DATABASE_URL y ejecutar migraciones
2. ✅ Hacer seed de servicios
3. ✅ Probar registro y login
4. ✅ Crear bicicleta y agendar cita

### Dashboard Admin (TODO):
- Vista de todas las citas
- Gestión de servicios (CRUD)
- Cambio de estado de citas
- Estadísticas del negocio
- Gestión de usuarios

### Integraciones Reales (Cuando estés listo):
- **Google Calendar API**: Configurar OAuth y credenciales
- **Nodemailer**: Configurar SMTP con Gmail App Password
- **Paguelo Facil**: Obtener credenciales de API y implementar flujo real

## 📱 PWA (Progressive Web App)

La aplicación está optimizada para ser instalada como PWA en dispositivos móviles:
- Manifest configurado
- Mobile-first design
- Animaciones optimizadas con Framer Motion
- Componentes Shadcn/UI responsivos

## 🧪 Testing

```bash
# Probar el flujo completo:
1. Abre https://cyclingpro-panama.preview.emergentagent.com
2. Regístrate con un nuevo usuario
3. Agrega una bicicleta
4. Agenda un servicio
5. Verifica que aparece en "Mis Citas"
6. Revisa los logs en consola para ver las notificaciones mockeadas
```

## 🐛 Troubleshooting

### Error: "Module not found: @supabase/ssr"
```bash
cd /app
yarn add @supabase/ssr@latest @supabase/supabase-js@latest
sudo supervisorctl restart nextjs
```

### Error: "Prisma Client not found"
```bash
cd /app
yarn prisma generate
sudo supervisorctl restart nextjs
```

### Error en las migraciones
```bash
# Verificar que DATABASE_URL esté correcto
cat .env | grep DATABASE_URL

# Forzar push del schema
yarn prisma db push --force-reset
```

## 📞 Soporte

Para cualquier duda o problema, verifica:
1. Logs del backend: `tail -f /var/log/supervisor/nextjs.out.log`
2. Variables de entorno correctas en `.env`
3. Prisma Client generado: `yarn prisma generate`

---

**Desarrollado con ❤️ para el mercado panameño de ciclismo**
