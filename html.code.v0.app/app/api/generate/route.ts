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
    errorMessage = 'Backend is not running. Start it with: cd backend && python main.py'
  } else if (error.message?.includes('fetch')) {
    errorMessage = 'Cannot reach backend at http://localhost:8001. Check if it is running.'
  }

  return Response.json(
    { error: errorMessage },
    { status: 503 }
  )
}
}
