const { PrismaClient } = require('@prisma/client')

// Probar diferentes formatos de connection string
const formats = [
  'postgresql://postgres:Panama2025.@db.lqsirpeqijpnrsmhypvd.supabase.co:5432/postgres',
  'postgresql://postgres:Panama2025.@db.lqsirpeqijpnrsmhypvd.supabase.co:6543/postgres',
  'postgresql://postgres.lqsirpeqijpnrsmhypvd:Panama2025.@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres.lqsirpeqijpnrsmhypvd:Panama2025.@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
]

async function testConnection(url, index) {
  console.log(`\n🔍 Testing format ${index + 1}...`)
  console.log(`URL: ${url.replace(/:[^:@]+@/, ':****@')}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
  
  try {
    await prisma.$connect()
    console.log('✅ Connection successful!')
    await prisma.$disconnect()
    return url
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`)
    await prisma.$disconnect()
    return null
  }
}

async function main() {
  for (let i = 0; i < formats.length; i++) {
    const result = await testConnection(formats[i], i)
    if (result) {
      console.log('\n✅ WORKING CONNECTION STRING:')
      console.log(result)
      process.exit(0)
    }
  }
  console.log('\n❌ None of the formats worked')
  process.exit(1)
}

main()
