'use client'

import { useState } from 'react'
import Header from '@/components/header'
import { flowGenerator } from '@/lib/llm/pipeline/flow-generator'
import { BRDParser } from '@/lib/llm/pipeline/brd-parser'

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<'input' | 'parsed' | 'flows'>('input')
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedBRD, setParsedBRD] = useState<any>(null)
  const [flows, setFlows] = useState<any[]>([])

  const loadExample = () => {
    setInput(`Service Name: Car Registration
Target Audience: Citizens
Goal: Register a new vehicle
Key Steps:
1. Identify user
2. Enter car details
3. Pay fee
4. Get digital tech passport`)
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      // 1. Parse BRD
      const parser = new BRDParser()
      const brd = await parser.parse(input)
      setParsedBRD(brd)
      
      // 2. Generate Flows
      const generatedFlows = await flowGenerator.generateVariants(brd)
      setFlows(generatedFlows)
      
      setActiveTab('flows')
    } catch (error) {
      console.error(error)
      alert('Pipeline failed. See console.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Header title="UX Pipeline" showBack />
      
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-8">
        {['input', 'parsed', 'flows'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 px-4 font-medium capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-medium">BRD / Requirements Text</label>
              <button onClick={loadExample} className="text-sm text-blue-500 hover:underline">
                Load Example
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste your requirements here..."
            />
            <button
              onClick={handleProcess}
              disabled={isProcessing || !input}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? 'Processing...' : '🚀 Run Pipeline'}
            </button>
          </div>
        )}

        {/* Parsed Tab */}
        {activeTab === 'parsed' && parsedBRD && (
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Structured Data (JSON)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(parsedBRD, null, 2))}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition flex items-center gap-1"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(parsedBRD, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `parsed-brd-${Date.now()}.json`
                    a.click()
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition flex items-center gap-1"
                >
                  💾 Download JSON
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(parsedBRD, null, 2)], { type: 'application/json' })
                    if (navigator.share) {
                      navigator.share({ files: [new File([blob], 'parsed-brd.json', { type: 'application/json' })] })
                    } else {
                      alert('Share not supported on this device')
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-purple-500 text-white hover:bg-purple-600 rounded-lg transition flex items-center gap-1"
                >
                  📤 Share
                </button>
              </div>
            </div>
            <pre className="font-mono text-sm overflow-auto max-h-[500px] text-green-600 dark:text-green-400 bg-black/5 dark:bg-white/5 p-4 rounded-lg">
              {JSON.stringify(parsedBRD, null, 2)}
            </pre>
          </div>
        )}

        {/* Flows Tab */}
        {activeTab === 'flows' && flows.length > 0 && (
          <div className="space-y-6">
            {/* Export All Buttons */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-500 mr-2">Export All:</span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(flows, null, 2))}
                className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                📋 Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(flows, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `flows-${Date.now()}.json`
                  a.click()
                }}
                className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition"
              >
                💾 Download JSON
              </button>
              <button
                onClick={() => {
                  const csv = flows.map(f => `${f.id},${f.name},${f.score},${f.estimatedTime}`).join('\n')
                  const blob = new Blob([`id,name,score,time\n${csv}`], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `flows-${Date.now()}.csv`
                  a.click()
                }}
                className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg transition"
              >
                📊 Download CSV
              </button>
              <button
                onClick={() => {
                  const yaml = flows.map(f => `- id: ${f.id}\n  name: ${f.name}\n  score: ${f.score}`).join('\n')
                  navigator.clipboard.writeText(yaml)
                  alert('YAML copied!')
                }}
                className="px-3 py-1.5 text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition"
              >
                📝 Copy YAML
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-medium bg-gray-500 text-white hover:bg-gray-600 rounded-lg transition"
              >
                🖨️ Print
              </button>
            </div>

            {/* Flows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flows.map(flow => (
              <div key={flow.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{flow.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                    {flow.score}/100
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  {flow.steps.map((step: any, i: number) => (
                    <div key={step.id} className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                        {i + 1}
                      </span>
                      <span className="font-medium">{step.component}</span>
                      <span className="text-xs text-gray-400 ml-auto">{step.type}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <span>⏱️ {flow.estimatedTime}s</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(flow, null, 2))}
                      className="text-gray-400 hover:text-blue-500"
                      title="Copy JSON"
                    >
                      📋
                    </button>
                    <button 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `flow-${flow.id}.json`
                        a.click()
                      }}
                      className="text-gray-400 hover:text-green-500"
                      title="Download"
                    >
                      💾
                    </button>
                    <button className="text-blue-500 hover:underline">View →</button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
