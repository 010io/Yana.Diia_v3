export async function POST(req: Request) {
  try {
    const { brd, numVariants = 3 } = await req.json()

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
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
        throw new Error(error.detail || 'Generation failed')
      }

      const data = await response.json()
      return Response.json(data)
    } catch (fetchError) {
      console.warn('[API] Backend unreachable, returning mock data', fetchError)

      // Graceful fallback with demo data
      return Response.json({
        champion: 1,
        variants: [
          {
            variant_id: 1,
            flow: {
              name: "Demo Service Flow (Offline Mode)",
              steps: [
                { step_id: 1, screen_name: "Авторизація", action: "Користувач входить через BankID" },
                { step_id: 2, screen_name: "Перевірка даних", action: "Система підтягує дані з реєстрів" },
                { step_id: 3, screen_name: "Завантаження документів", action: "Користувач додає скан-копії" },
                { step_id: 4, screen_name: "Підписання", action: "Накладання КЕП/Дія.Підпис" },
                { step_id: 5, screen_name: "Результат", action: "Заявка успішно відправлена" }
              ]
            },
            logic_score: 8.5,
            design_score: 9.0,
            completeness_score: 8.0,
            minimality_score: 9.5,
            total_score: 8.75
          }
        ],
        is_mock: true
      })
    }
  } catch (error: any) {
    console.error('[v0] Generation API error:', error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
