'use client'

import { ComplianceIssue } from '@/lib/llm/pipeline/flow-evaluator'

interface ComplianceReportProps {
  issues: ComplianceIssue[]
}

export function ComplianceReport({ issues }: ComplianceReportProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🔴'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📋'
    }
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900'
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900'
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800'
    }
  }

  if (issues.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 p-6 rounded-xl text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">All Clear!</h3>
        <p className="text-sm text-green-600 dark:text-green-400">
          No compliance issues detected. Flow meets Diia standards.
        </p>
      </div>
    )
  }

  const errorCount = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length
  const infoCount = issues.filter(i => i.severity === 'info').length

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        {errorCount > 0 && (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span>🔴</span>
            <span className="font-bold">{errorCount}</span>
            <span>errors</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <span>⚠️</span>
            <span className="font-bold">{warningCount}</span>
            <span>warnings</span>
          </div>
        )}
        {infoCount > 0 && (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <span>ℹ️</span>
            <span className="font-bold">{infoCount}</span>
            <span>info</span>
          </div>
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getSeverityClass(issue.severity)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{getSeverityIcon(issue.severity)}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{issue.component}</h4>
                  <span className="text-xs uppercase tracking-wide opacity-60 font-medium">
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm mb-2 opacity-90">{issue.message}</p>
                {issue.recommendation && (
                  <div className="text-xs bg-white/50 dark:bg-black/20 p-2 rounded border border-current/10">
                    <span className="font-semibold">Recommendation:</span> {issue.recommendation}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
