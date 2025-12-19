#!/bin/bash

SUPABASE_URL="https://lqsirpeqijpnrsmhypvd.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxc2lycGVxaWpwbnJzbWh5cHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjEyMDg4OCwiZXhwIjoyMDgxNjk2ODg4fQ.Womq5aq5SvzamUfTGM1eDGYP-gtQVuHznVYVAd3l5PU"

echo "🚀 Creating database schema via Supabase API..."
echo ""

# Ejecutar el SQL init
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "query": "SELECT 1"
}
EOF

echo ""
echo "Note: Supabase might not have exec_sql RPC enabled."
echo "Let's try creating tables using SQL Editor manually..."
echo ""
echo "✅ SQL script is ready at: /app/prisma/init.sql"
echo "👉 Please execute it in Supabase SQL Editor"
