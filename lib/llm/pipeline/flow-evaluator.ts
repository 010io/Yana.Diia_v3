import { ServiceFlow } from './flow-generator'
import { mockLLM } from '@/lib/llm/providers/mock'

export interface EvaluationMetrics {
  flowLength: number        // 0-100: оптимальна кількість кроків
  compliance: number        // 0-100: відповідність Diia Design System
  saturation: number        // 0-100: повнота UX (не занадто мало/багато)
  security: number          // 0-100: безпека (auth, validation)
  apiIntegration: number    // 0-100: якість інтеграції APIs
  combined: number          // 0-100: загальна оцінка
  explanation: string       // текстове пояснення
}

export interface ComplianceIssue {
  severity: 'error' | 'warning' | 'info'
  component: string
  message: string
  recommendation?: string
}

export class FlowEvaluator {
  /**
   * Evaluate a single flow using Constitutional AI principles
   */
  async evaluate(flow: ServiceFlow): Promise<EvaluationMetrics> {
    console.log(`⚖️ Evaluating flow: ${flow.name}`)

    try {
      // Call LLM-as-Judge
      const result = await mockLLM.call('evaluate-flow', { flow })
      
      return {
        flowLength: result.flowLength,
        compliance: result.compliance,
        saturation: result.saturation,
        security: result.security,
        apiIntegration: result.apiIntegration,
        combined: result.combined,
        explanation: result.explanation
      }
    } catch (error) {
      console.error('Evaluation failed:', error)
      return this.getDefaultMetrics()
    }
  }

  /**
   * Rank multiple flows by their combined score
   */
  rankFlows(flows: ServiceFlow[], evaluations: EvaluationMetrics[]): ServiceFlow[] {
    const scored = flows.map((flow, index) => ({
      flow,
      score: evaluations[index]?.combined || 0
    }))

    scored.sort((a, b) => b.score - a.score)
    
    return scored.map(item => item.flow)
  }

  /**
   * Check Diia Design System compliance
   */
  checkCompliance(flow: ServiceFlow): ComplianceIssue[] {
    const issues: ComplianceIssue[] = []

    // Rule 1: Must have authentication
    const hasAuth = flow.steps.some(s => s.type === 'diia_signature')
    if (!hasAuth) {
      issues.push({
        severity: 'error',
        component: 'Authentication',
        message: 'Flow must include Diia.Signature authentication',
        recommendation: 'Add DiiaSignatureButton as first step'
      })
    }

    // Rule 2: Must have result screen
    const hasResult = flow.steps.some(s => s.type === 'result')
    if (!hasResult) {
      issues.push({
        severity: 'warning',
        component: 'Result',
        message: 'Flow should include a success/result screen',
        recommendation: 'Add SuccessBanner component at the end'
      })
    }

    // Rule 3: Optimal flow length (3-7 steps)
    if (flow.steps.length < 3) {
      issues.push({
        severity: 'warning',
        component: 'Flow',
        message: 'Flow is too short, may lack necessary steps',
        recommendation: 'Consider adding review or confirmation steps'
      })
    } else if (flow.steps.length > 7) {
      issues.push({
        severity: 'info',
        component: 'Flow',
        message: 'Flow is long, users may abandon',
        recommendation: 'Combine or simplify steps where possible'
      })
    }

    // Rule 4: All required steps must be at the beginning
    const requiredSteps = flow.steps.filter(s => s.required)
    const optionalSteps = flow.steps.filter(s => !s.required)
    
    if (requiredSteps.length > 0 && optionalSteps.length > 0) {
      const lastRequiredIndex = flow.steps.lastIndexOf(requiredSteps[requiredSteps.length - 1])
      const firstOptionalIndex = flow.steps.indexOf(optionalSteps[0])
      
      if (firstOptionalIndex < lastRequiredIndex) {
        issues.push({
          severity: 'warning',
          component: 'Flow Order',
          message: 'Required steps should come before optional ones',
          recommendation: 'Reorder steps to put all required steps first'
        })
      }
    }

    return issues
  }

  /**
   * Check WCAG 2.1 AA accessibility
   */
  checkAccessibility(flow: ServiceFlow): ComplianceIssue[] {
    const issues: ComplianceIssue[] = []

    // Check for alt text on images (simplified)
    flow.steps.forEach(step => {
      if (step.type === 'info' && !step.props?.altText) {
        issues.push({
          severity: 'warning',
          component: step.component,
          message: 'Missing alt text for accessibility',
          recommendation: 'Add altText prop to component'
        })
      }
    })

    // Check for keyboard navigation
    const hasInputs = flow.steps.some(s => s.type === 'input')
    if (hasInputs) {
      issues.push({
        severity: 'info',
        component: 'Inputs',
        message: 'Ensure all inputs are keyboard accessible',
        recommendation: 'Test with Tab navigation'
      })
    }

    return issues
  }

  private getDefaultMetrics(): EvaluationMetrics {
    return {
      flowLength: 50,
      compliance: 50,
      saturation: 50,
      security: 50,
      apiIntegration: 50,
      combined: 50,
      explanation: 'Unable to evaluate at this time'
    }
  }
}

export const flowEvaluator = new FlowEvaluator()
