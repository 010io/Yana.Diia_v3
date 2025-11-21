// TypeScript Configuration for Next.js 16
export enum LLMMode {
  PRODUCTION = 'production',
  STAGING = 'staging',
  MOCK = 'mock'
}

export interface LLMConfig {
  mode: LLMMode
  providers: {
    openai: ProviderConfig
    anthropic: ProviderConfig
    litellm: ProviderConfig
  }
}

export interface ProviderConfig {
  apiKey?: string
  endpoint?: string
  maxTokens: number
  mock: boolean
}

const getCurrentMode = (): LLMMode => {
  const mode = process.env.LLM_MODE || process.env.NEXT_PUBLIC_LLM_MODE || 'mock'
  
  if (mode === 'production') return LLMMode.PRODUCTION
  if (mode === 'staging') return LLMMode.STAGING
  return LLMMode.MOCK
}

export const LLM_CONFIG: LLMConfig = {
  mode: getCurrentMode(),
  
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      maxTokens: getCurrentMode() === LLMMode.PRODUCTION ? 4000 : 100,
      mock: getCurrentMode() === LLMMode.MOCK
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxTokens: getCurrentMode() === LLMMode.PRODUCTION ? 4000 : 100,
      mock: getCurrentMode() === LLMMode.MOCK
    },
    litellm: {
      endpoint: process.env.LITELLM_ENDPOINT,
      apiKey: process.env.LITELLM_API_KEY,
      maxTokens: getCurrentMode() === LLMMode.PRODUCTION ? 4000 : 100,
      mock: getCurrentMode() === LLMMode.MOCK
    }
  }
}

// Helper to check if we're in Mock Mode
export const isMockMode = () => LLM_CONFIG.mode === LLMMode.MOCK
export const isStagingMode = () => LLM_CONFIG.mode === LLMMode.STAGING
export const isProductionMode = () => LLM_CONFIG.mode === LLMMode.PRODUCTION
