'use client'

import { useState } from 'react'
import { ServiceFlow } from '@/lib/llm/pipeline/flow-generator'
import { quantumOptimizer, OptimizationHistory } from '@/lib/quantum/simulated-annealing'
import { flowGenerator } from '@/lib/llm/pipeline/flow-generator'
import { motion } from 'framer-motion'

export default function QuantumPage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [history, setHistory] = useState<OptimizationHistory | null>(null)
  const [variants, setVariants] = useState<ServiceFlow[]>([])
  const [progress, setProgress] = useState(0)

  const runOptimization = async () => {
    setIsOptimizing(true)
    setProgress(0)

    try {
      // Generate initial flows
      const mockBRD = {
        serviceName: 'Finance.AI',
        intent: 'Financial assistance',
        category: 'finance',
        targetAudience: ['IDP'],
        prerequisites: [],
        requiredDocuments: [],
        apiIntegrations: ['NBU']
      }

      const initialFlows = await flowGenerator.generateVariants(mockBRD, 3)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 99))
      }, 30)

      // Run quantum optimization
      const result = await quantumOptimizer.optimize(initialFlows)
      setHistory(result)

      // Generate 3 variants from best flow
      const optimizedVariants = quantumOptimizer.generateVariants(result.bestFlow)
      setVariants(optimizedVariants)

      clearInterval(progressInterval)
      setProgress(100)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🌌 Quantum Flow Optimizer</h1>
      <p className="text-gray-500 mb-8">
        Використовує симуляцію квантового відпалювання для пошуку оптимального UX flow
      </p>

      {/* Control Panel */}
      <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isOptimizing ? '🔄 Optimizing...' : '🚀 Start Quantum Optimization'}
        </button>

        {isOptimizing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Visualization */}
      {history && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Energy Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold mb-4">📉 Energy Convergence</h3>
            <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
              {/* Simple SVG visualization */}
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <defs>
                  <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Energy line */}
                <polyline
                  points={history.iterations.map((r, i) => 
                    `${(i / history.iterations.length) * 400},${200 - (r.energy / 100) * 180}`
                  ).join(' ')}
                  fill="none"
                  stroke="url(#energyGradient)"
                  strokeWidth="3"
                />

                {/* Grid lines */}
                {[0, 50, 100].map(y => (
                  <line
                    key={y}
                    x1="0"
                    y1={200 - (y / 100) * 180}
                    x2="400"
                    y2={200 - (y / 100) * 180}
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                ))}
              </svg>
              
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {history.iterations.length} iterations
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold mb-4">📊 Optimization Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <span className="text-sm">Initial Energy</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {history.iterations[0]?.energy.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <span className="text-sm">Final Energy</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {history.iterations[history.iterations.length - 1]?.energy.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="text-sm">Improvement</span>
                <span className="font-mono font-bold text-green-600 dark:text-green-400">
                  {((1 - history.iterations[history.iterations.length - 1]?.energy / history.iterations[0]?.energy) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimized Variants */}
      {variants.length > 0 && (
        <div>
          <h2 className="font-bold text-xl mb-4">✨ Quantum-Optimized Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {variants.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold">{variant.name}</h3>
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-bold">
                    {variant.score}/100
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {variant.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step.component}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>⏱️ {variant.estimatedTime}s</span>
                  <span>🎯 {variant.steps.length} steps</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
