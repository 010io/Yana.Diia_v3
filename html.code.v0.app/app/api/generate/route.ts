export async function POST(req: Request) {
  try {
    const { brd, numVariants = 3 } = await req.json()

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(`${backendUrl}/api/v1/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brd,
        num_variants: numVariants,
        design_system: 'diia'
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ error: error.detail || 'Generation failed' }, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error: any) {
    console.error('[v0] Generation API error:', error)
    
    let errorMessage = 'Backend connection failed'
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Backend is taking too long.'
    } else if (error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Backend is not running. Start it with: python -m yana_diia.main (see BACKEND_SETUP.md)'
    } else if (error.message?.includes('fetch')) {
      errorMessage = 'Cannot reach backend at http://localhost:8000. Check if it is running.'
    }
    
    return Response.json(
      { error: errorMessage },
      { status: 503 }
    )
  }
}
