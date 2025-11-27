import { mockLLM } from '@/lib/llm/providers/mock'

export interface BRDStructure {
  serviceName: string
  intent: string
  category: string
  targetAudience: string[]
  prerequisites: string[]
  requiredDocuments: string[]
  apiIntegrations: string[]
  legalBasis?: string
}

export class BRDParser {
  /**
   * Parse raw text BRD into structured data
   */
  async parse(rawText: string): Promise<BRDStructure> {
    console.log('📄 Parsing BRD...')
    
    // In a real app, this would call the LLM with a specific prompt
    // For now, we use the mock provider
    try {
      const result = await mockLLM.call('parse-brd', { text: rawText })
      
      // Transform mock response to match interface if needed
      return {
        serviceName: result.serviceName,
        intent: result.intent,
        category: result.category,
        targetAudience: result.userRoles,
        prerequisites: result.constraints,
        requiredDocuments: ['Passport', 'Tax ID'], // Mock default
        apiIntegrations: result.apiDependencies,
        legalBasis: 'Postanova KMU #123'
      }
    } catch (error) {
      console.error('BRD Parsing failed:', error)
      throw new Error('Failed to parse BRD')
    }
  }

  /**
   * Validate if the BRD contains enough information
   */
  validate(structure: BRDStructure): { valid: boolean; missing: string[] } {
    const missing: string[] = []
    
    if (!structure.serviceName) missing.push('Service Name')
    if (!structure.intent) missing.push('User Intent')
    if (!structure.targetAudience || structure.targetAudience.length === 0) missing.push('Target Audience')
    
    return {
      valid: missing.length === 0,
      missing
    }
  }
}

export const brdParser = new BRDParser()
