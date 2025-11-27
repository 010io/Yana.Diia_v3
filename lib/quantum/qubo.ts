import { ServiceFlow, FlowStep } from '@/lib/llm/pipeline/flow-generator'

/**
 * QUBO (Quadratic Unconstrained Binary Optimization) Energy Function
 * Maps flow optimization to energy minimization problem
 */
export class QUBOEncoder {
  /**
   * Calculate energy for a given flow configuration
   * Lower energy = better flow
   */
  calculateEnergy(flow: ServiceFlow): number {
    // Energy components (all normalized to 0-100 range)
    const stepPenalty = this.stepCountPenalty(flow.steps.length)
    const requiredBonus = this.requiredStepsBonus(flow.steps)
    const orderPenalty = this.orderPenalty(flow.steps)
    const timePenalty = this.timePenalty(flow.estimatedTime)
    
    // Weighted sum (lower is better)
    const energy = (
      stepPenalty * 0.3 +
      requiredBonus * 0.2 +
      orderPenalty * 0.2 +
      timePenalty * 0.3
    )
    
    return energy
  }

  /**
   * Penalize flows that are too short or too long
   * Optimal: 3-5 steps
   */
  private stepCountPenalty(stepCount: number): number {
    const optimal = 4
    const deviation = Math.abs(stepCount - optimal)
    return Math.min(deviation * 15, 100) // Scale: 0-100
  }

  /**
   * Bonus for having all required steps at the beginning
   */
  private requiredStepsBonus(steps: FlowStep[]): number {
    const requiredIndices = steps
      .map((step, i) => step.required ? i : -1)
      .filter(i => i !== -1)
    
    if (requiredIndices.length === 0) return 0
    
    const maxRequired = Math.max(...requiredIndices)
    const idealMax = requiredIndices.length - 1
    
    // Penalty if required steps are scattered
    return Math.min((maxRequired - idealMax) * 20, 100)
  }

  /**
   * Penalize bad ordering (e.g., result before input)
   */
  private orderPenalty(steps: FlowStep[]): number {
    let penalty = 0
    
    // Auth should be first
    const authIndex = steps.findIndex(s => s.type === 'diia_signature')
    if (authIndex > 1) penalty += 30
    
    // Result should be last
    const resultIndex = steps.findIndex(s => s.type === 'result')
    if (resultIndex !== -1 && resultIndex < steps.length - 1) penalty += 30
    
    return Math.min(penalty, 100)
  }

  /**
   * Penalize flows that take too long
   * Optimal: < 90 seconds
   */
  private timePenalty(estimatedTime: number): number {
    if (estimatedTime <= 60) return 0
    if (estimatedTime <= 90) return 10
    if (estimatedTime <= 120) return 30
    return 60
  }
}

export const quboEncoder = new QUBOEncoder()
