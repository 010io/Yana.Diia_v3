import { LLM_CONFIG, LLMMode } from '@/config/llm-modes'
import { MockLLMProvider } from './providers/mock'

export interface LLMProvider {
  call(endpoint: string, params?: any): Promise<any>
  stream(endpoint: string, params?: any): AsyncGenerator<string>
}

/**
 * Get the appropriate LLM provider based on current mode
 */
export function getLLMProvider(): LLMProvider {
  switch (LLM_CONFIG.mode) {
    case LLMMode.MOCK:
      console.log('🧪 Using MOCK mode (no token usage)')
      return new MockLLMProvider()
    
    case LLMMode.STAGING:
      console.log('🔶 Using STAGING mode (limited tokens)')
      // TODO: Return real provider with limited tokens
      return new MockLLMProvider() // Fallback to mock for now
    
    case LLMMode.PRODUCTION:
      console.log('🚀 Using PRODUCTION mode (full tokens)')
      // TODO: Return real LiteLLM provider
      return new MockLLMProvider() // Fallback to mock for now
    
    default:
      console.warn('⚠️ Unknown LLM mode, defaulting to MOCK')
      return new MockLLMProvider()
  }
}
