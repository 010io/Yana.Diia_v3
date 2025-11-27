import { mockLLM } from '@/lib/llm/providers/mock'
import { BRDStructure } from './brd-parser'

export interface FlowStep {
  id: string
  screen: string
  type: 'diia_signature' | 'input' | 'review' | 'info' | 'result' | 'upload'
  component: string
  required: boolean
  props?: Record<string, any>
}

export interface ServiceFlow {
  id: string
  name: string
  description?: string
  steps: FlowStep[]
  estimatedTime: number // seconds
  score: number // 0-100
  tags: string[]
}

export class FlowGenerator {
  /**
   * Generate multiple flow variants based on parsed BRD
   */
  async generateVariants(brd: BRDStructure, count: number = 3): Promise<ServiceFlow[]> {
    console.log(`🔄 Generating ${count} flow variants for: ${brd.serviceName}`)
    
    try {
      // Call mock LLM to get variants
      const result = await mockLLM.call('generate-flows', { brd, count })
      
      // Map result to ServiceFlow interface
      return result.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        description: `Generated flow for ${brd.targetAudience[0] || 'users'}`,
        steps: variant.steps.map((step: any, index: number) => ({
          id: `step-${index}`,
          ...step
        })),
        estimatedTime: variant.estimatedTime,
        score: variant.score,
        tags: ['generated', 'v1']
      }))
    } catch (error) {
      console.error('Flow generation failed:', error)
      return []
    }
  }

  /**
   * Convert a flow to JSON format compatible with Lego Constructor
   */
  toLegoFormat(flow: ServiceFlow): any[] {
    return flow.steps.map(step => ({
      id: step.component.toLowerCase(), // Simplified mapping
      name: step.component,
      category: this.mapTypeToCategory(step.type),
      uniqueId: Date.now() + Math.random()
    }))
  }

  private mapTypeToCategory(type: string): string {
    switch (type) {
      case 'diia_signature': return 'auth'
      case 'input': return 'form'
      case 'review': return 'layout'
      case 'info': return 'content'
      case 'result': return 'feedback'
      default: return 'layout'
    }
  }
}

export const flowGenerator = new FlowGenerator()
