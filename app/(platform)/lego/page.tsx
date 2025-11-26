'use client'

import { useState } from 'react'
import { ComponentLibrary } from '@/components/lego-diia/component-library'
import { Canvas } from '@/components/lego-diia/canvas'
import { YanaAnalyzer } from '@/components/lego-diia/yana-analyzer'
import componentsData from '@/config/diia-components.json'
import { diiaProvider } from '@/lib/llm/providers/diia'
import { openDataBotProvider } from '@/lib/llm/providers/openDataBot'

import { useLegoStore } from '@/lib/stores/lego-store'

export default function LegoPage() {
  const { items: canvasItems, addItem, removeItem, setItems } = useLegoStore()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!draggedItem) return
    
    const component = componentsData.find(c => c.id === draggedItem)
    if (component) {
      addItem({ ...component, uniqueId: Date.now(), dataSource: 'mock' })
    }
    setDraggedItem(null)
  }

  const handleRemove = (index: number) => {
    // Note: canvas.tsx passes index, but we need uniqueId. 
    // For now, let's assume canvas passes the item or we find it by index.
    // Ideally refactor Canvas to pass item.uniqueId
    const itemToRemove = canvasItems[index]
    if (itemToRemove) {
      removeItem(itemToRemove.uniqueId)
    }
  }

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    // TODO: Implement reordering logic
  }

  const connectToRealApi = async () => {
    setIsConnecting(true)
    try {
      // Simulate connection check to real providers
      await diiaProvider.getDocuments('test_token')
      await openDataBotProvider.searchCompany('12345678')
      
      // Update items to show they are "Live"
      setItems(canvasItems.map(item => ({
        ...item,
        dataSource: 'live',
        status: 'connected'
      })))
      
      alert('✅ Connected to Diia & OpenDataBot APIs (Mock Mode Active)')
    } catch (e) {
      console.error(e)
      alert('❌ Connection Failed')
    } finally {
      setIsConnecting(false)
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
          <button 
            onClick={connectToRealApi}
            disabled={isConnecting}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
              isConnecting ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20'
            }`}
          >
            {isConnecting ? 'Connecting...' : '🔌 Connect Real APIs'}
          </button>
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
