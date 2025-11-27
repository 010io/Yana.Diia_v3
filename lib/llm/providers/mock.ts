// Mock LLM Provider - 0 token usage for development
export class MockLLMProvider {
  private name = 'MockProvider'
  
  // Pre-defined mock responses for all endpoints
  private responses: Record<string, any> = {
    'parse-brd': {
      intent: 'Виплата допомоги ВПО',
      serviceName: 'Finance.AI - Фінансові пільги',
      category: 'finance',
      entities: ['amount', 'recipient', 'bank_account', 'idp_status'],
      constraints: ['ukrainian_citizen', 'registered_idp', 'diia_auth'],
      userRoles: ['громадяни України', 'ВПО', 'пенсіонери'],
      apiDependencies: ['NBU', 'OpenDataBot', 'NAIS']
    },
    
    'generate-flows': [
      {
        id: 'flow-minimal',
        name: 'Мінімальний (3 кроки)',
        steps: [
          { 
            screen: 'auth', 
            type: 'diia_signature',
            component: 'DiiaSignatureButton',
            required: true
          },
          { 
            screen: 'amount', 
            type: 'input',
            component: 'AmountInput',
            required: true
          },
          { 
            screen: 'success', 
            type: 'result',
            component: 'SuccessBanner',
            required: true
          }
        ],
        estimatedTime: 45,
        score: 92
      },
      {
        id: 'flow-standard',
        name: 'Стандартний (5 кроків)',
        steps: [
          { screen: 'auth', type: 'diia_signature', component: 'DiiaSignatureButton', required: true },
          { screen: 'profile', type: 'review', component: 'ProfileCard', required: false },
          { screen: 'amount', type: 'input', component: 'AmountInput', required: true },
          { screen: 'confirm', type: 'review', component: 'SummaryCard', required: true },
          { screen: 'success', type: 'result', component: 'SuccessBanner', required: true }
        ],
        estimatedTime: 90,
        score: 85
      },
      {
        id: 'flow-educational',
        name: 'Навчальний (7 кроків)',
        steps: [
          { screen: 'intro', type: 'info', component: 'IntroCard', required: false },
          { screen: 'auth', type: 'diia_signature', component: 'DiiaSignatureButton', required: true },
          { screen: 'profile', type: 'review', component: 'ProfileCard', required: false },
          { screen: 'amount', type: 'input', component: 'AmountInput', required: true },
          { screen: 'bank', type: 'input', component: 'BankAccountForm', required: true },
          { screen: 'confirm', type: 'review', component: 'SummaryCard', required: true },
          { screen: 'success', type: 'result', component: 'SuccessBanner', required: true }
        ],
        estimatedTime: 150,
        score: 78
      }
    ],
    
    'evaluate-flow': {
      flowLength: 85,
      compliance: 92,
      saturation: 88,
      security: 95,
      apiIntegration: 90,
      combined: 90,
      explanation: 'Flow має оптимальну кількість кроків (5), повністю відповідає Diia Design System, та використовує правильні Ukraine Gov APIs.'
    },
    
    'ai-debate': {
      transcript: `
Леся Українка: "Цей flow чудовий! Він враховує емпатію до користувачів. Три варіанти - це демократично."

Ярослав Мудрий: "Безпека на високому рівні. Diia.Signature гарантує автентифікацію. Схвалюю."

Зеленський: "Друзі, це саме те, що потрібно громадянам. Швидко, зручно, безпечно. Затверджую!"

Кличко: "Де тут сервер?! Дайте мені його адресу! Я хочу перевірити інфраструктуру!"

НБУ: "Фінансово обґрунтовано. API інтеграція коректна. Бюджет затверджую."

Усік: "Я не зламався. Цей flow теж не зламається. Перемога за нами! 🥇"
      `,
      consensus: true,
      variants: ['minimal', 'standard', 'educational']
    },
    
    'quantum-optimize': {
      energy: 42.7,
      iterations: 1000,
      optimalVariants: [
        { name: 'Minimal', steps: 3, energy: 38.2 },
        { name: 'Standard', steps: 5, energy: 42.7 },
        { name: 'Educational', steps: 7, energy: 51.3 }
      ]
    }
  }
  
  async call(endpoint: string, params?: any): Promise<any> {
    // Simulate network delay
    await this.delay(500)
    
    // Log for debugging
    console.log(`[MOCK ${this.name}] Endpoint: ${endpoint}`, params)
    
    // Return pre-defined response
    const response = this.responses[endpoint]
    
    if (!response) {
      console.warn(`[MOCK] No response defined for endpoint: ${endpoint}`)
      return {
        error: 'Mock response not found',
        suggestion: `Add mock data for '${endpoint}' to MockLLMProvider.responses`
      }
    }
    
    return response
  }
  
  async *stream(endpoint: string, params?: any): AsyncGenerator<string> {
    const response = await this.call(endpoint, params)
    const text = JSON.stringify(response, null, 2)
    
    // Simulate streaming character by character
    for (const char of text) {
      yield char
      await this.delay(10)
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const mockLLM = new MockLLMProvider()
