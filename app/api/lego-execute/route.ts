import { NextRequest, NextResponse } from 'next/server'
import { lego2api, executeService } from '@/lib/lego/lego-builder'
import type { LegoComponent } from '@/lib/lego/types'

/**
 * POST /api/lego-execute
 * Виконує LEGO послугу з реальними API викликами
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blocks, userId, formData } = body as {
      blocks: LegoComponent[]
      userId?: string
      formData?: Record<string, any>
    }

    // Validate input
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid blocks array' },
        { status: 400 }
      )
    }

    // Convert LEGO blocks to executable service
    const service = await lego2api(blocks)

    // Execute service with context
    const result = await executeService(service, {
      userId: userId || 'anonymous',
      formData: formData || {}
    })

    // Return result
    return NextResponse.json({
      success: result.success,
      service: {
        id: service.id,
        name: service.name,
        description: service.description
      },
      result: result.result,
      error: result.error,
      executionLog: result.steps,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('LEGO Execute Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/lego-execute
 * Повертає доступні API інтеграції
 */
export async function GET() {
  return NextResponse.json({
    availableAPIs: [
      {
        id: 'nais',
        name: 'NAIS (Національна автоматизована інформаційна система)',
        actions: [
          { id: 'nais_fop_register', name: 'Реєстрація ФОП' },
          { id: 'nais_fop_status', name: 'Статус ФОП' }
        ]
      },
      {
        id: 'diia',
        name: 'Дія API',
        actions: [
          { id: 'diia_auth', name: 'Авторизація DiiaID' },
          { id: 'diia_documents', name: 'Отримання документів' }
        ]
      },
      {
        id: 'youcontrol',
        name: 'YouControl',
        actions: [
          { id: 'youcontrol_search', name: 'Пошук компаній' },
          { id: 'youcontrol_company', name: 'Інформація про компанію' }
        ]
      },
      {
        id: 'subsidies',
        name: 'Субсидії',
        actions: [
          { id: 'subsidy_check', name: 'Перевірка права на субсидію' },
          { id: 'subsidy_apply', name: 'Подати заявку' }
        ]
      },
      {
        id: 'data_gov_ua',
        name: 'Data.gov.ua',
        actions: [
          { id: 'data_gov_search', name: 'Пошук датасетів' }
        ]
      }
    ]
  })
}