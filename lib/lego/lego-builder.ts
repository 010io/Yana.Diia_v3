// LEGO → Real API Builder
// Перетворює блоки в виконувані послуги з реальними API викликами

import type { LegoComponent } from './types'

export interface ServiceStep {
  type: 'form' | 'api_call' | 'result' | 'validation' | 'auth'
  data?: any
  endpoint?: string
  method?: string
  auth?: string
  fields?: any
  source?: string
  display?: any
}

export interface ExecutableService {
  id: string
  name: string
  description: string
  steps: ServiceStep[]
  metadata: {
    created: string
    author: string
    version: string
  }
}

// API Endpoints для державних сервісів
export const GOVERNMENT_APIS = {
  NAIS: {
    base: 'https://api.nais.gov.ua',
    endpoints: {
      registerFOP: '/v1/fop/register',
      checkStatus: '/v1/fop/status',
      getInfo: '/v1/fop/info'
    }
  },
  DIIA: {
    base: 'https://api.diia.gov.ua',
    endpoints: {
      auth: '/v1/auth',
      documents: '/v1/documents',
      services: '/v1/services'
    }
  },
  DATA_GOV_UA: {
    base: 'https://data.gov.ua/api/3',
    endpoints: {
      datasets: '/action/package_list',
      search: '/action/package_search'
    }
  },
  YOUCONTROL: {
    base: 'https://api.youcontrol.com.ua',
    endpoints: {
      search: '/v1/search',
      company: '/v1/company'
    }
  },
  SUBSIDIES: {
    base: 'https://subsidies.gov.ua/api',
    endpoints: {
      check: '/v1/check',
      apply: '/v1/apply',
      status: '/v1/status'
    }
  }
}

/**
 * Перетворює LEGO блоки в виконувану послугу
 */
export async function lego2api(blocks: LegoComponent[]): Promise<ExecutableService> {
  const service: ExecutableService = {
    id: `service_${Date.now()}`,
    name: blocks[0]?.props?.title || 'Нова послуга',
    description: blocks[0]?.props?.description || '',
    steps: [],
    metadata: {
      created: new Date().toISOString(),
      author: 'Yana.Diia LEGO',
      version: '1.0.0'
    }
  }

  for (const block of blocks) {
    // 1. Auth Block → DiiaID Authentication
    if (block.type === 'auth' || block.props?.requiresAuth) {
      service.steps.push({
        type: 'auth',
        endpoint: GOVERNMENT_APIS.DIIA.base + GOVERNMENT_APIS.DIIA.endpoints.auth,
        method: 'POST',
        auth: 'DiiaID'
      })
    }

    // 2. Form Block → Data Collection
    if (block.type === 'form') {
      service.steps.push({
        type: 'form',
        fields: block.props?.fields || [],
        data: {
          validation: true,
          required: block.props?.required || []
        }
      })
    }

    // 3. Action Block → Real API Call
    if (block.type === 'action') {
      const action = block.props?.action

      // NAIS FOP Registration
      if (action === 'nais_fop_register') {
        service.steps.push({
          type: 'api_call',
          endpoint: GOVERNMENT_APIS.NAIS.base + GOVERNMENT_APIS.NAIS.endpoints.registerFOP,
          method: 'POST',
          auth: 'DiiaID',
          fields: {
            fullName: '{{form.fullName}}',
            address: '{{form.address}}',
            businessType: '{{form.businessType}}',
            taxId: '{{form.taxId}}'
          }
        })
      }

      // YouControl Company Search
      if (action === 'youcontrol_search') {
        service.steps.push({
          type: 'api_call',
          endpoint: GOVERNMENT_APIS.YOUCONTROL.base + GOVERNMENT_APIS.YOUCONTROL.endpoints.search,
          method: 'GET',
          fields: {
            query: '{{form.companyName}}',
            limit: 10
          }
        })
      }

      // Subsidy Check
      if (action === 'subsidy_check') {
        service.steps.push({
          type: 'api_call',
          endpoint: GOVERNMENT_APIS.SUBSIDIES.base + GOVERNMENT_APIS.SUBSIDIES.endpoints.check,
          method: 'POST',
          auth: 'DiiaID',
          fields: {
            userId: '{{auth.userId}}',
            category: '{{form.category}}'
          }
        })
      }

      // Data.gov.ua Dataset Search
      if (action === 'data_gov_search') {
        service.steps.push({
          type: 'api_call',
          endpoint: GOVERNMENT_APIS.DATA_GOV_UA.base + GOVERNMENT_APIS.DATA_GOV_UA.endpoints.search,
          method: 'GET',
          fields: {
            q: '{{form.searchQuery}}'
          }
        })
      }
    }

    // 4. Result Block → Display Response
    if (block.type === 'result' || block.type === 'display') {
      service.steps.push({
        type: 'result',
        source: 'prev_api_response',
        display: block.props?.template || {
          type: 'json',
          fields: ['*']
        }
      })
    }

    // 5. Validation Block
    if (block.type === 'validation') {
      service.steps.push({
        type: 'validation',
        data: {
          rules: block.props?.rules || [],
          onError: block.props?.onError || 'stop'
        }
      })
    }
  }

  return service
}

/**
 * Виконує послугу крок за кроком
 */
export async function executeService(
  service: ExecutableService,
  context: {
    userId?: string
    diiaToken?: string
    formData?: Record<string, any>
  }
): Promise<{
  success: boolean
  result?: any
  error?: string
  steps: Array<{ step: number; status: string; data?: any }>
}> {
  const executionLog: Array<{ step: number; status: string; data?: any }> = []
  let currentContext = { ...context }

  try {
    for (let i = 0; i < service.steps.length; i++) {
      const step = service.steps[i]

      // Execute Auth
      if (step.type === 'auth') {
        // Mock auth for demo (replace with real DiiaID)
        currentContext.diiaToken = `mock_token_${Date.now()}`
        executionLog.push({ step: i, status: 'success', data: { authenticated: true } })
      }

      // Execute Form (collect data)
      if (step.type === 'form') {
        // Form data already in context
        executionLog.push({ step: i, status: 'success', data: currentContext.formData })
      }

      // Execute API Call
      if (step.type === 'api_call') {
        // Replace template variables {{form.field}}
        const body = replaceTemplateVars(step.fields || {}, currentContext)

        // Real API call (with fallback to mock for demo)
        try {
          const response = await fetch(step.endpoint!, {
            method: step.method || 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(step.auth === 'DiiaID' && currentContext.diiaToken
                ? { Authorization: `Bearer ${currentContext.diiaToken}` }
                : {})
            },
            body: step.method !== 'GET' ? JSON.stringify(body) : undefined
          })

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
          }

          const result = await response.json()
          currentContext.result = result
          executionLog.push({ step: i, status: 'success', data: result })
        } catch (error) {
          // Fallback to mock for demo
          const mockResult = generateMockResponse(step.endpoint!)
          currentContext.result = mockResult
          executionLog.push({ 
            step: i, 
            status: 'mock', 
            data: { ...mockResult, _note: 'Mock data for demo' } 
          })
        }
      }

      // Execute Result Display
      if (step.type === 'result') {
        executionLog.push({ 
          step: i, 
          status: 'success', 
          data: currentContext.result 
        })
      }
    }

    return {
      success: true,
      result: currentContext.result,
      steps: executionLog
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      steps: executionLog
    }
  }
}

/**
 * Замінює template змінні на реальні значення
 */
function replaceTemplateVars(obj: any, context: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      const keys = path.split('.')
      let value = context
      for (const key of keys) {
        value = value?.[key]
      }
      return value || ''
    })
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceTemplateVars(item, context))
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceTemplateVars(value, context)
    }
    return result
  }

  return obj
}

/**
 * Генерує mock відповіді для demo
 */
function generateMockResponse(endpoint: string): any {
  if (endpoint.includes('fop/register')) {
    return {
      success: true,
      fopId: `FOP${Math.floor(Math.random() * 1000000)}`,
      registrationNumber: `${Math.floor(Math.random() * 10000000000)}`,
      status: 'registered',
      registeredAt: new Date().toISOString()
    }
  }

  if (endpoint.includes('youcontrol')) {
    return {
      results: [
        {
          name: 'ТОВ "Приклад"',
          edrpou: '12345678',
          status: 'active',
          director: 'Іванов І.І.'
        }
      ]
    }
  }

  if (endpoint.includes('subsidy')) {
    return {
      eligible: true,
      amount: 5000,
      category: 'housing',
      validUntil: '2024-12-31'
    }
  }

  return { success: true, data: 'Mock response' }
}