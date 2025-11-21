'use client'

import { useState, useEffect } from 'react'
import { LLMMode } from '@/config/llm-modes'

interface DevPanelProps {
  initialMode?: LLMMode
}

export function DevPanel({ initialMode = LLMMode.MOCK }: DevPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<LLMMode>(initialMode)
  const [stats, setStats] = useState({
    tokensUsed: 0,
    requestsCount: 0,
    averageLatency: 0
  })
  
  // Konami Code activation: ↑↑↓↓←→←→BA
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ]
    let position = 0
    
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      
      if (key === konamiCode[position] || key === konamiCode[position].toLowerCase()) {
        position++
        if (position === konamiCode.length) {
          setIsOpen(true)
          console.log('🎮 Konami Code activated! Dev Panel opened.')
          position = 0
        }
      } else {
        position = 0
      }
    }
    
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  
  // Don't show in production unless explicitly enabled
  if (!isOpen && process.env.NEXT_PUBLIC_SHOW_DEV_PANEL !== 'true') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-2xl w-96 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          🛠️ Dev Panel
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">BETA</span>
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>
      
      {/* LLM Mode Selector */}
      <div className="mb-4">
        <label className="block text-sm mb-2 text-gray-300">LLM Mode:</label>
        <select 
          value={mode}
          onChange={(e) => setMode(e.target.value as LLMMode)}
          className="w-full bg-gray-800 p-2 rounded border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value={LLMMode.MOCK}>🧪 Mock (No tokens)</option>
          <option value={LLMMode.STAGING}>🔶 Staging (Limited)</option>
          <option value={LLMMode.PRODUCTION}>🚀 Production (Full)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {mode === LLMMode.MOCK && '✅ Розробка без витрат токенів'}
          {mode === LLMMode.STAGING && '⚠️ Обмежені токени для тестування'}
          {mode === LLMMode.PRODUCTION && '💰 Повна функціональність (витрачає токени)'}
        </p>
      </div>
      
      {/* Token Usage Stats */}
      <div className="mb-4 bg-gray-800 p-3 rounded border border-gray-700">
        <h4 className="text-sm font-semibold mb-2 text-gray-300">Статистика:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Токенів витрачено:</span>
            <span className="font-mono text-green-400">{stats.tokensUsed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Запитів:</span>
            <span className="font-mono text-blue-400">{stats.requestsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Середня затримка:</span>
            <span className="font-mono text-yellow-400">{stats.averageLatency}ms</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm transition">
          🗑️ Clear Cache
        </button>
        <button className="bg-green-600 hover:bg-green-700 p-2 rounded text-sm transition">
          🔄 Reset Mocks
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded text-sm transition">
          📊 Export Logs
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm transition">
          📚 API Docs
        </button>
      </div>
      
      {/* Advanced Settings */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-gray-300 hover:text-white transition">
          ⚙️ Advanced Settings
        </summary>
        <div className="mt-2 space-y-2 pl-4">
          <label className="flex items-center text-xs text-gray-400">
            <input type="checkbox" className="mr-2" />
            Enable Response Caching
          </label>
          <label className="flex items-center text-xs text-gray-400">
            <input type="checkbox" className="mr-2" defaultChecked />
            Log All Requests
          </label>
          <label className="flex items-center text-xs text-gray-400">
            <input type="checkbox" className="mr-2" />
            Show Token Costs
          </label>
        </div>
      </details>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Press <kbd className="bg-gray-800 px-1 rounded">↑↑↓↓←→←→BA</kbd> to toggle
      </div>
    </div>
  )
}
