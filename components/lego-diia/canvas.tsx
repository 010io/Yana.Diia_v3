'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader2 } from 'lucide-react'

interface CanvasProps {
  items: any[]
  onDrop: (e: React.DragEvent) => void
  onRemove: (index: number) => void
  onSelect: (index: number) => void
  onReorder: (dragIndex: number, hoverIndex: number) => void
  selectedItem: any | null
  onExecute?: () => Promise<void>
  isExecuting?: boolean
}

export function Canvas({ items, onDrop, onRemove, onSelect, onReorder, selectedItem, onExecute, isExecuting }: CanvasProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    onDrop(e)
  }

  return (
    <div 
      className="h-full bg-gray-100 dark:bg-black p-8 overflow-y-auto flex justify-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Phone Frame */}
      <div className={`
        w-[375px] min-h-[812px] bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl border-8 border-gray-800 dark:border-gray-700 relative overflow-hidden transition-all duration-300
        ${isOver ? 'scale-105 ring-4 ring-blue-500/50' : ''}
      `}>
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>
        
        {/* Status Bar Placeholder */}
        <div className="h-12 w-full bg-white dark:bg-gray-900 z-40 sticky top-0 flex justify-between items-center px-6 text-xs font-medium">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[calc(100%-48px)] pb-8">
          {items.length === 0 ? (
            <div className="h-[600px] flex flex-col items-center justify-center text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 m-4 rounded-2xl">
              <span className="text-4xl mb-4">🏗️</span>
              <p>Drag components here to build your service</p>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    onClick={() => onSelect(index)}
                    className={`relative group transition-colors cursor-pointer ${
                      selectedItem?.uniqueId === item.uniqueId
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {/* Mock Component Render */}
                    <div className="p-4 pointer-events-none">
                      <div className="flex items-center gap-3">
                        {item.category === 'auth' && <div className="w-full h-12 bg-black text-white rounded-lg flex items-center justify-center font-medium">Diia.Signature</div>}
                        {item.category === 'form' && <div className="w-full h-12 border rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center px-4 text-gray-400">{item.name}</div>}
                        {item.category === 'layout' && <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">{item.name}</div>}
                        {item.category === 'content' && (
                          <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-bold mb-1">{item.name}</h4>
                            <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                          </div>
                        )}
                        {!['auth', 'form', 'layout', 'content'].includes(item.category) && (
                          <div className="w-full p-4 border border-dashed rounded text-center text-sm text-gray-500">
                            {item.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onRemove(index)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Execute Button */}
        {items.length > 0 && onExecute && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
            <button
              onClick={onExecute}
              disabled={isExecuting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Виконується...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Виконати послугу
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black dark:bg-white rounded-full opacity-20"></div>
      </div>
    </div>
  )
}
