'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { flowGenerator } from '@/lib/llm/pipeline/flow-generator'
import { BRDParser } from '@/lib/llm/pipeline/brd-parser'
import { useLegoStore } from '@/lib/stores/lego-store'

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<'input' | 'parsed' | 'flows'>('input')
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedBRD, setParsedBRD] = useState<any>(null)
  const [flows, setFlows] = useState<any[]>([])
  const { setItems } = useLegoStore()
  const router = useRouter()

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

  const handleViewFlow = (flow: any) => {
    // Clear previous flow data first
    localStorage.removeItem('lego_import_flow')

    // Convert flow steps to proper LEGO components with smart mapping
    const legoComponents = flow.steps.map((step: any, index: number) => {
      const componentName = step.component.toLowerCase()
      const stepType = step.type || 'info'
      
      // Smart mapping based on component name and type
      let registryId = 'info-card'
      let props: any = {}
      let name = step.component
      
      // Map by component name patterns
      if (componentName.includes('signature') || componentName.includes('diia')) {
        registryId = 'diia-signature'
        name = 'Diia.Signature'
        props = { 
          documentHash: 'mock-hash-' + Date.now(), 
          redirectUrl: '/success' 
        }
      } else if (componentName.includes('amount') || componentName.includes('input')) {
        // Determine input type
        const isNumber = componentName.includes('amount') || componentName.includes('number') || componentName.includes('sum');
        
        registryId = isNumber ? 'number-input' : 'text-input';
        name = isNumber ? 'Сума' : 'Введення даних';
        
        props = { 
          label: step.component || (isNumber ? 'Введіть суму' : 'Введіть дані'),
          placeholder: step.description || (isNumber ? '0.00' : 'Введіть текст'),
          value: isNumber ? '' : ''
        }
      } else if (componentName.includes('success') || componentName.includes('banner')) {
        registryId = 'success-banner'
        name = 'SuccessBanner'
        props = { 
          title: 'Вітаємо!', 
          message: 'Ви успішно пройшли процес. Ви можете перевірити статус заявки у своєму профілі.' 
        }
      } else if (componentName.includes('profile') || componentName.includes('card')) {
        registryId = 'info-card'
        name = 'ProfileCard'
        props = { 
          title: 'Ваш профіль', 
          text: 'Перевірте дані вашого профілю',
          icon: '👤'
        }
      } else if (componentName.includes('summary') || componentName.includes('confirm')) {
        registryId = 'info-card'
        name = 'SummaryCard'
        props = { 
          title: 'Підтвердження', 
          text: 'Перевірте всі дані перед відправкою',
          icon: '📋'
        }
      } else if (componentName.includes('intro') || componentName.includes('info')) {
        registryId = 'info-card'
        name = 'IntroCard'
        props = { 
          title: 'Інформація', 
          text: 'Ознайомтесь з інструкцією перед початком',
          icon: 'ℹ️'
        }
      } else if (componentName.includes('bank') || componentName.includes('account')) {
        registryId = 'info-card'
        name = 'BankAccountForm'
        props = { 
          title: 'Банківський рахунок', 
          text: 'Введіть дані вашого банківського рахунку',
          icon: '🏦'
        }
      } else if (componentName.includes('payment')) {
        registryId = 'monobank-payment'
        name = 'Payment'
        props = { 
          amount: 10000, 
          description: 'Оплата послуги' 
        }
      } else if (componentName.includes('chip') || componentName.includes('badge')) {
        registryId = 'chip';
        name = 'Chip';
        const isSuccess = componentName.includes('status') || componentName.includes('success');
        const isWarning = componentName.includes('deadline') || componentName.includes('warning');
        props = {
          label: step.description || 'Label',
          variant: isSuccess ? 'success' : isWarning ? 'warning' : 'default'
        }
      } else if (componentName.includes('list') || componentName.includes('item') || componentName.includes('row')) {
        registryId = 'list-item';
        name = 'List Item';
        props = {
          title: step.component.replace(/_/g, ' '),
          subtitle: step.description,
          action: true,
          icon: componentName.includes('bank') ? '🏦' : componentName.includes('card') ? '💳' : '📄'
        }
      } else if (componentName.includes('detail') || componentName.includes('summary')) {
        registryId = 'detail-card';
        name = 'Details';
        props = {
          title: 'Деталі',
          items: [
            { label: 'Статус', value: 'Очікується' },
            { label: 'Дата', value: new Date().toLocaleDateString() }
          ]
        }
      } else {
        // Fallback to info card
        registryId = 'info-card'
        name = step.component
        props = { 
          title: step.component, 
          text: step.description || 'Крок процесу',
          icon: '📄'
        }
      }
      
      return {
        id: registryId,
        uniqueId: Date.now() + index + Math.random() * 1000,
        name,
        category: stepType === 'diia_signature' ? 'auth' : 
                  stepType === 'input' ? 'form' : 
                  stepType === 'result' ? 'layout' : 'layout',
        dataSource: 'mock' as const,
        props
      }
    })
    
    // Add "Execute Service" button at the end (before success banner if exists)
    const hasSuccessBanner = legoComponents.some(c => c.id === 'success-banner')
    const insertIndex = hasSuccessBanner ? legoComponents.length - 1 : legoComponents.length
    
    legoComponents.splice(insertIndex, 0, {
      id: 'action-button',
      uniqueId: Date.now() + 9999,
      name: 'Виконати послугу',
      category: 'form',
      dataSource: 'mock' as const,
      props: {
        text: 'Виконати послугу',
        variant: 'primary'
      }
    })
    
    // Store in localStorage for LEGO page to pick up
    localStorage.setItem('lego_import_flow', JSON.stringify(legoComponents))
    
    // Navigate to LEGO
    router.push('/lego')
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
      <h1 className="text-3xl font-bold mb-6">🚀 UX Pipeline</h1>
      
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
                    <button 
                      onClick={() => handleViewFlow(flow)}
                      className="text-blue-500 hover:underline"
                    >
                      View →
                    </button>
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
