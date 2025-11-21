'use client'

import { EvaluationMetrics, ComplianceIssue } from '@/lib/llm/pipeline/flow-evaluator'

interface MetricsDisplayProps {
  metrics: EvaluationMetrics
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const categories = [
    { key: 'flowLength', label: 'Flow Length', color: 'blue' },
    { key: 'compliance', label: 'Diia Compliance', color: 'green' },
    { key: 'saturation', label: 'UX Saturation', color: 'purple' },
    { key: 'security', label: 'Security', color: 'red' },
    { key: 'apiIntegration', label: 'API Integration', color: 'yellow' }
  ]

  const getColorClass = (color: string, type: 'bg' | 'text') => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
      green: { bg: 'bg-green-500', text: 'text-green-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600' },
      red: { bg: 'bg-red-500', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600' }
    }
    return colors[color]?.[type] || colors.blue[type]
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-xl text-center border border-blue-100 dark:border-blue-900">
        <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {metrics.combined}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Overall Quality Score
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {categories.map(cat => {
          const value = metrics[cat.key as keyof EvaluationMetrics] as number
          return (
            <div key={cat.key}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{cat.label}</span>
                <span className={`text-sm font-bold ${getColorClass(cat.color, 'text')}`}>
                  {value}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getColorClass(cat.color, 'bg')} transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
        <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300">
          💡 AI Explanation
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
          {metrics.explanation}
        </p>
      </div>
    </div>
  )
}
