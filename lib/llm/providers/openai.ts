import OpenAI from 'openai'

export class OpenAIProvider {
  private client: OpenAI
  
  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })
  }

  async call(operation: string, params: any): Promise<any> {
    switch (operation) {
      case 'parse-brd':
        return this.parseBRD(params.text)
      case 'generate-flows':
        return this.generateFlows(params.brd, params.count)
      case 'evaluate-flow':
        return this.evaluateFlow(params.flow || params.items)
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  private async parseBRD(text: string) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a BRD (Business Requirements Document) parser for Ukrainian government services. 
Extract structured information from the text and return JSON with:
- serviceName: string
- intent: string (what the service does)
- category: string (e.g., "social", "business", "documents")
- userRoles: string[] (who can use this service)
- constraints: string[] (prerequisites, limitations)
- apiDependencies: string[] (which government APIs are needed)

Respond ONLY with valid JSON, no markdown.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')
    
    try {
      return JSON.parse(content)
    } catch (e) {
      // If not valid JSON, try to extract JSON from markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1])
      }
      throw new Error('Failed to parse BRD response')
    }
  }

  private async generateFlows(brd: any, count: number = 3) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a UX flow generator for Ukrainian government services using Diia Design System.
Generate ${count} different user flow variants for the given service.

Each flow should be a JSON object with:
- id: string
- name: string
- steps: array of {screen: string, type: string, component: string, required: boolean}
- estimatedTime: number (seconds)
- score: number (0-100, your estimate of quality)

Available component types: diia_signature, input, review, info, result, upload
Available components: DiiaHeader, DiiaSignatureButton, InfoCard, InputAmount, BankSelect, SuccessBanner, WarningAlert, ProcessStepper, DiiaFooter, DocumentUpload

Respond with JSON array of ${count} flows, no markdown.`
        },
        {
          role: 'user',
          content: JSON.stringify(brd)
        }
      ],
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')
    
    try {
      return JSON.parse(content)
    } catch (e) {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1])
      }
      throw new Error('Failed to parse flows response')
    }
  }

  private async evaluateFlow(flow: any) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a Constitutional AI Judge evaluating Ukrainian government service flows.
Rate the flow on these metrics (0-100 each):
- flowLength: optimal number of steps (3-7 is ideal)
- compliance: adherence to Diia Design System
- saturation: UX completeness (not too sparse, not too dense)
- security: proper authentication and validation
- apiIntegration: use of government APIs vs manual input

Also provide:
- combined: weighted average (flowLength*0.25 + compliance*0.30 + saturation*0.15 + security*0.20 + apiIntegration*0.10)
- explanation: 2-3 sentences explaining the scores

Respond with JSON only, no markdown.`
        },
        {
          role: 'user',
          content: JSON.stringify(flow)
        }
      ],
      temperature: 0.3,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')
    
    try {
      return JSON.parse(content)
    } catch (e) {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1])
      }
      throw new Error('Failed to parse evaluation response')
    }
  }
}

// Singleton instance
let openaiProvider: OpenAIProvider | null = null

export function getOpenAIProvider(): OpenAIProvider {
  if (!openaiProvider) {
    openaiProvider = new OpenAIProvider()
  }
  return openaiProvider
}

export const openaiLLM = {
  call: (operation: string, params: any) => {
    return getOpenAIProvider().call(operation, params)
  }
}
