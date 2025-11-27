'use client'

import { useState } from 'react'
import { ComponentLibrary } from '@/components/lego-diia/component-library'
import { Canvas } from '@/components/lego-diia/canvas'
import { PropertyEditor } from '@/components/lego-diia/property-editor'
import { componentRegistry } from '@/lib/lego/component-registry'
import { useLegoStore } from '@/lib/stores/lego-store'
import { buildService, type LegoMode } from '@/lib/lego/dual-mode-builder'

export default function LegoPage() {
  const { items: canvasItems, addItem, removeItem, updateItem } = useLegoStore()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [mode, setMode] = useState<LegoMode>('hackathon')
  const [exportResult, setExportResult] = useState<any>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDrop = () => {
    if (!draggedItem) return
    
    const component = componentRegistry.get(draggedItem)
    if (component) {
      const newItem = {
        ...component,
        uniqueId: Date.now(),
        dataSource: 'mock' as const,
        config: {},
      }
      addItem(newItem as any)
      setSelectedItem(newItem)
    }
    setDraggedItem(null)
  }

  const handleRemove = (index: number) => {
    const itemToRemove = canvasItems[index]
    if (itemToRemove) {
      removeItem(itemToRemove.uniqueId)
      if (selectedItem?.uniqueId === itemToRemove.uniqueId) {
        setSelectedItem(null)
      }
    }
  }

  const handleSelect = (index: number) => {
    setSelectedItem(canvasItems[index])
  }

  const handleUpdateItem = (uniqueId: number, updates: any) => {
    updateItem(uniqueId, updates)
    // Update selected item if it's the one being edited
    if (selectedItem?.uniqueId === uniqueId) {
      setSelectedItem({ ...selectedItem, ...updates })
    }
  }

  const handleReorder = () => {
    // TODO: Implement reordering logic
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const response = await fetch('/api/lego-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: canvasItems,
          userId: 'demo_user',
          formData: {
            fullName: 'Іванов Іван Іванович',
            address: 'м. Київ, вул. Хрещатик, 1',
            businessType: 'Роздрібна торгівля',
            taxId: '1234567890'
          }
        })
      })

      const result = await response.json()
      setExecutionResult(result)
      
      // Show result modal
      alert(JSON.stringify(result, null, 2))
    } catch (error: any) {
      alert('Помилка виконання: ' + error.message)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/30 flex items-center px-4 justify-between bg-gradient-to-b from-background/80 to-background/20 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-sm">Я</span>
            </div>
            <span className="font-bold text-foreground text-lg hidden md:block">Yana.Diia</span>
          </a>
          <div className="h-6 w-px bg-border/50 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🧱</span>
            <h1 className="font-bold text-foreground">Lego Constructor</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex items-center bg-black/20 rounded-lg p-1">
            <button 
              onClick={() => setMode('hackathon')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                mode === 'hackathon' 
                  ? 'bg-yellow-500 text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🎨 Hackathon
            </button>
            <button 
              onClick={() => setMode('production')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                mode === 'production' 
                  ? 'bg-green-500 text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              ⚙️ Production
            </button>
          </div>

          {/* Mode Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            mode === 'hackathon' 
              ? 'bg-yellow-500/10 border-yellow-500/20' 
              : 'bg-green-500/10 border-green-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              mode === 'hackathon' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span className={`text-xs font-medium ${
              mode === 'hackathon' ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {mode === 'hackathon' ? 'Макети' : 'Full-Stack'}
            </span>
          </div>
          
          <button 
            onClick={async () => {
              const result = await buildService(canvasItems as any, mode)
              setExportResult(result)
              if (mode === 'hackathon' && result.exports?.html) {
                const blob = new Blob([result.exports.html], { type: 'text/html' })
                const url = URL.createObjectURL(blob)
                window.open(url, '_blank')
              } else {
                alert(JSON.stringify(result, null, 2))
              }
            }}
            className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition shadow-lg shadow-primary/20"
          >
            {mode === 'hackathon' ? '📥 Export Mockup' : '🚀 Deploy'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 flex-shrink-0">
          <ComponentLibrary onDragStart={handleDragStart} />
        </div>
        
        <div className="flex-1 relative">
          <Canvas 
            items={canvasItems} 
            onDrop={handleDrop}
            onRemove={handleRemove}
            onSelect={handleSelect}
            onReorder={handleReorder}
            selectedItem={selectedItem}
            onExecute={handleExecute}
            isExecuting={isExecuting}
          />
        </div>
        
        <div className="w-80 flex-shrink-0">
          <PropertyEditor 
            selectedItem={selectedItem}
            onUpdate={handleUpdateItem}
          />
        </div>
      </div>
    </div>
  )
}
