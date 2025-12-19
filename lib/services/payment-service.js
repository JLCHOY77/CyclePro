// Paguelo Facil Service - Mocked
// Simulación de procesamiento de pagos con Yappy y tarjetas

export async function createPayment({ amount, method, yappiPhone, cardDetails }) {
  console.log('💳 [MOCKED] Procesando pago con Paguelo Facil...')
  console.log('Monto:', amount)
  console.log('Método:', method)
  
  if (method === 'YAPPY') {
    console.log('Teléfono Yappy:', yappiPhone)
  } else if (method === 'CARD') {
    console.log('Tarjeta:', cardDetails?.cardNumber?.slice(-4))
  }
  
  // Simulación de delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const mockReference = `PGF-${Date.now()}`
  
  return {
    success: true,
    reference: mockReference,
    status: 'COMPLETED',
    transactionId: `txn-${Date.now()}`,
    message: '✅ Pago procesado exitosamente (MOCK)'
  }
}

export async function verifyPayment(reference) {
  console.log('💳 [MOCKED] Verificando pago...')
  console.log('Referencia:', reference)
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    status: 'COMPLETED',
    message: '✅ Pago verificado (MOCK)'
  }
}

export async function refundPayment(reference) {
  console.log('💳 [MOCKED] Procesando reembolso...')
  console.log('Referencia:', reference)
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    status: 'REFUNDED',
    message: '✅ Reembolso procesado (MOCK)'
  }
}