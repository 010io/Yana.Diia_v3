'use client'

import { useState } from 'react'
import { ComponentLibrary } from '@/components/lego-diia/component-library'
import { Canvas } from '@/components/lego-diia/canvas'
import { PropertyEditor } from '@/components/lego-diia/property-editor'
import { componentRegistry } from '@/lib/lego/component-registry'
import { useLegoStore } from '@/lib/stores/lego-store'

export default function LegoPage() {
  const { items: canvasItems, addItem, removeItem, updateItem } = useLegoStore()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

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
          {/* API Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-500">APIs Active</span>
          </div>
          
          <button className="px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition">
            Preview
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition shadow-lg shadow-primary/20">
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
            onSelect={handleSelect}
            onReorder={handleReorder}
            selectedItem={selectedItem}
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
