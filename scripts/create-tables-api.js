require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 CyclingPRO - Creating tables via Supabase Management API...\n')

async function createTables() {
  console.log('📋 IMPORTANT: To create the database schema, please follow these steps:\n')
  
  console.log('1️⃣  Go to Supabase SQL Editor:')
  console.log('   https://supabase.com/dashboard/project/lqsirpeqijpnrsmhypvd/sql/new\n')
  
  console.log('2️⃣  Copy and paste the following SQL:\n')
  console.log('─'.repeat(80))
  
  const sql = `
-- CyclingPRO Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'IN_WORKSHOP', 'COMPLETED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "PaymentMethod" AS ENUM ('YAPPY', 'CARD', 'CASH'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bicycles table
CREATE TABLE IF NOT EXISTS "bicycles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT UNIQUE,
    "color" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bicycles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Services table
CREATE TABLE IF NOT EXISTS "services" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "bicycleId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "googleEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "bookings_bicycleId_fkey" FOREIGN KEY ("bicycleId") REFERENCES "bicycles"("id") ON DELETE CASCADE,
    CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL UNIQUE,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "pagueloFacilRef" TEXT,
    "yappiPhone" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "bicycles_userId_idx" ON "bicycles"("userId");
CREATE INDEX IF NOT EXISTS "bookings_userId_idx" ON "bookings"("userId");
CREATE INDEX IF NOT EXISTS "bookings_bicycleId_idx" ON "bookings"("bicycleId");
CREATE INDEX IF NOT EXISTS "bookings_serviceId_idx" ON "bookings"("serviceId");
CREATE INDEX IF NOT EXISTS "bookings_date_idx" ON "bookings"("date");
CREATE INDEX IF NOT EXISTS "transactions_bookingId_idx" ON "transactions"("bookingId");

-- Insert sample services
INSERT INTO "services" ("id", "name", "description", "price", "duration", "isActive") VALUES
    (uuid_generate_v4(), 'Mantenimiento Básico', 'Ajuste de frenos, cambios y lubricación de cadena', 25.00, 60, true),
    (uuid_generate_v4(), 'Mantenimiento Completo', 'Mantenimiento completo incluyendo revisión de componentes', 50.00, 120, true),
    (uuid_generate_v4(), 'Reparación de Llanta', 'Cambio de llanta o reparación de pinchazo', 15.00, 30, true),
    (uuid_generate_v4(), 'Ajuste de Frenos', 'Ajuste y calibración de sistema de frenos', 20.00, 45, true),
    (uuid_generate_v4(), 'Cambio de Cadena', 'Reemplazo de cadena desgastada', 35.00, 45, true),
    (uuid_generate_v4(), 'Limpieza Profunda', 'Limpieza completa y detallada de la bicicleta', 30.00, 90, true),
    (uuid_generate_v4(), 'Ajuste de Cambios', 'Calibración del sistema de transmisión', 20.00, 40, true),
    (uuid_generate_v4(), 'Revisión General', 'Inspección completa de todos los componentes', 15.00, 30, true)
ON CONFLICT DO NOTHING;
`
  
  console.log(sql)
  console.log('─'.repeat(80))
  console.log('\n3️⃣  Click "Run" or press Ctrl+Enter\n')
  console.log('4️⃣  You should see: "Success. No rows returned"\n')
  console.log('5️⃣  Verify tables were created:')
  console.log('   Go to Table Editor and you should see:')
  console.log('   ✅ users')
  console.log('   ✅ bicycles')
  console.log('   ✅ services (with 8 sample services)')
  console.log('   ✅ bookings')
  console.log('   ✅ transactions\n')
  console.log('📝 Once done, let me know and we\'ll test the app!\n')
}

createTables()
