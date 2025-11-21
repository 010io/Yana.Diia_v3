'use client'

import { useState, useEffect } from 'react'
import { flowGenerator, ServiceFlow } from '@/lib/llm/pipeline/flow-generator'
import { flowEvaluator, EvaluationMetrics, ComplianceIssue } from '@/lib/llm/pipeline/flow-evaluator'
import { MetricsDisplay } from '@/components/evaluation/metrics-display'
import { ComplianceReport } from '@/components/evaluation/compliance-report'

export default function EvaluationPage() {
  const [flows, setFlows] = useState<ServiceFlow[]>([])
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null)
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([])
  const [accessibilityIssues, setAccessibilityIssues] = useState<ComplianceIssue[]>([])
  const [isEvaluating, setIsEvaluating] = useState(false)

  const selectedFlow = flows.find(f => f.id === selectedFlowId)

  const loadDemoFlows = async () => {
    // Generate sample flows
    const mockBRD = {
      serviceName: 'Finance.AI - Demo',
      intent: 'Financial assistance',
      category: 'finance',
      targetAudience: ['IDP', 'Citizens'],
      prerequisites: ['Diia.Auth'],
      requiredDocuments: [],
      apiIntegrations: ['NBU', 'OpenDataBot']
    }
    
    const generated = await flowGenerator.generateVariants(mockBRD, 3)
    setFlows(generated)
    if (generated.length > 0) {
      setSelectedFlowId(generated[0].id)
    }
  }

  useEffect(() => {
    loadDemoFlows()
  }, [])

  useEffect(() => {
    if (selectedFlow) {
      evaluateFlow(selectedFlow)
    }
  }, [selectedFlowId])

  const evaluateFlow = async (flow: ServiceFlow) => {
    setIsEvaluating(true)
    try {
      const evaluation = await flowEvaluator.evaluate(flow)
      setMetrics(evaluation)

      const compliance = flowEvaluator.checkCompliance(flow)
      setComplianceIssues(compliance)

      const accessibility = flowEvaluator.checkAccessibility(flow)
      setAccessibilityIssues(accessibility)
    } catch (error) {
      console.error('Evaluation error:', error)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Flow Evaluation Lab</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flow Selection */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold mb-4">Select Flow to Evaluate</h2>
          <div className="space-y-3">
            {flows.map(flow => (
              <button
                key={flow.id}
                onClick={() => setSelectedFlowId(flow.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedFlowId === flow.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-300'
                }`}
              >
                <h3 className="font-medium mb-1">{flow.name}</h3>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{flow.steps.length} steps</span>
                  <span>{flow.estimatedTime}s</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Results */}
        <div className="lg:col-span-2 space-y-8">
          {selectedFlow && metrics ? (
            <>
              {/* Metrics */}
              <div>
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  📊 Quality Metrics
                  {isEvaluating && <span className="text-sm text-gray-500 animate-pulse">Evaluating...</span>}
                </h2>
                <MetricsDisplay metrics={metrics} />
              </div>

              {/* Diia Compliance */}
              <div>
                <h2 className="font-semibold mb-4">✅ Diia Design System Compliance</h2>
                <ComplianceReport issues={complianceIssues} />
              </div>

              {/* Accessibility */}
              <div>
                <h2 className="font-semibold mb-4">♿ WCAG 2.1 AA Accessibility</h2>
                <ComplianceReport issues={accessibilityIssues} />
              </div>

              {/* Flow Preview */}
              <div>
                <h2 className="font-semibold mb-4">🔍 Flow Steps</h2>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  <ol className="space-y-2">
                    {selectedFlow.steps.map((step, i) => (
                      <li key={step.id} className="flex items-center gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="font-medium">{step.component}</span>
                        <span className="text-xs text-gray-400">({step.type})</span>
                        {step.required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Select a flow to view evaluation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
