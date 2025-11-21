'use client'

import { useState } from 'react'
import { ComponentLibrary } from '@/components/lego-diia/component-library'
import { Canvas } from '@/components/lego-diia/canvas'
import { YanaAnalyzer } from '@/components/lego-diia/yana-analyzer'
import componentsData from '@/config/diia-components.json'

export default function LegoPage() {
  const [canvasItems, setCanvasItems] = useState<any[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!draggedItem) return
    
    const component = componentsData.find(c => c.id === draggedItem)
    if (component) {
      setCanvasItems(prev => [...prev, { ...component, uniqueId: Date.now() }])
    }
    setDraggedItem(null)
  }

  const handleRemove = (index: number) => {
    setCanvasItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    // TODO: Implement reordering logic
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧱</span>
          <h1 className="font-bold">Lego-Diia Constructor</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition">
            Preview
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition">
            Export
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
            onReorder={handleReorder}
          />
        </div>
        
        <div className="w-80 flex-shrink-0">
          <YanaAnalyzer items={canvasItems} />
        </div>
      </div>
    </div>
  )
}
