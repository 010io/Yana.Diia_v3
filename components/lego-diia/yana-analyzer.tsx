'use client'

import { useState, useEffect } from 'react'
import { mockLLM } from '@/lib/llm/providers/mock'

interface YanaAnalyzerProps {
  items: any[]
}

export function YanaAnalyzer({ items }: YanaAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length > 0) {
      analyzeFlow()
    }
  }, [items])

  const analyzeFlow = async () => {
    setLoading(true)
    try {
      // In a real app, we'd send the items to the LLM
      // Here we use the mock provider
      const result = await mockLLM.call('evaluate-flow', { items })
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 w-80">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="font-bold text-lg flex items-center gap-2">
          🤖 Yana AI
          {loading && <span className="animate-spin">⏳</span>}
        </h2>
        <button 
          onClick={analyzeFlow}
          className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="mb-2">👋 Привіт! Я Yana.</p>
            <p className="text-sm">Додайте компоненти на екран, і я проаналізую вашу послугу.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <div className="text-center mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  {analysis?.combined || 0}
                </span>
                <span className="text-gray-400 text-sm">/100</span>
              </div>
              <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                Overall Score
              </p>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <MetricBar label="Compliance" value={analysis?.compliance || 0} color="bg-green-500" />
              <MetricBar label="UX Saturation" value={analysis?.saturation || 0} color="bg-purple-500" />
              <MetricBar label="Security" value={analysis?.security || 0} color="bg-red-500" />
              <MetricBar label="API Integration" value={analysis?.apiIntegration || 0} color="bg-yellow-500" />
            </div>

            {/* Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300">
                💡 AI Insight
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                {analysis?.explanation || "Analyzing..."}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition">
                ✨ Optimize with Quantum
              </button>
              <button className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                💬 Start Debate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}
