'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader2, ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react'

export interface LegoComponentItem {
  id: string
  uniqueId: number
  name: string
  category: string
  props?: Record<string, any>
  dataSource?: 'mock' | 'live'
}

interface CanvasProps {
  items: LegoComponentItem[]
  onDrop: (e: React.DragEvent) => void
  onRemove: (index: number) => void
  onSelect: (index: number) => void
  onReorder: (dragIndex: number, hoverIndex: number) => void
  selectedItem: LegoComponentItem | null
  onExecute?: () => Promise<void>
  isExecuting?: boolean
}

export function Canvas({ items, onDrop, onRemove, onSelect, selectedItem, onExecute, isExecuting }: CanvasProps) {
  const [isOver, setIsOver] = useState(false)
  const [currentScreen, setCurrentScreen] = useState(0)

  // Group components into screens (split by action buttons)
  const screens = useMemo(() => {
    if (items.length === 0) return []
    
    const result: LegoComponentItem[][] = []
    let currentScreenItems: LegoComponentItem[] = []
    
    items.forEach((item, index) => {
      currentScreenItems.push(item)
      
      // Split into new screen after action buttons
      // We check for specific IDs or names that imply an action/navigation
      const isActionButton = item.id === 'action-button' || 
                            item.name.toLowerCase().includes('button') ||
                            item.name.toLowerCase().includes('послугу') ||
                            item.name.toLowerCase().includes('далі')
      
      if (isActionButton && index < items.length - 1) {
        result.push(currentScreenItems)
        currentScreenItems = []
      }
    })
    
    // Add remaining items as last screen
    if (currentScreenItems.length > 0) {
      result.push(currentScreenItems)
    }
    
    return result.length > 0 ? result : [items]
  }, [items])

  // Reset to first screen when items change significantly (e.g. new flow loaded)
  // But try to keep position if just adding items
  useEffect(() => {
    if (currentScreen >= screens.length) {
      setCurrentScreen(Math.max(0, screens.length - 1))
    }
  }, [screens.length, currentScreen])

  // Helper to safely get component name
  const getComponentName = (item: LegoComponentItem) => {
    if (!item) return 'Component'
    return item.name || item.id || 'Component'
  }

  // Helper to render a single component
  const renderComponent = (item: LegoComponentItem, index: number) => {
    const isSelected = selectedItem?.uniqueId === item.uniqueId
    
    return (
      <motion.div
        key={item.uniqueId || index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        onClick={() => onSelect(index)}
        className={`relative group cursor-pointer mb-3 transition-all ${
          isSelected ? 'ring-2 ring-blue-500 rounded-2xl' : ''
        }`}
      >
        {/* Component Content */}
        <div className="w-full pointer-events-none select-none">
          {item.id === 'diia-signature' ? (
            <div className="w-full py-4 px-5 bg-black text-white rounded-[20px] flex items-center justify-between font-semibold text-[17px] shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-sm">✍️</div>
                <span>{item.props?.title || 'Дія.Підпис'}</span>
              </div>
              <ChevronLeft className="w-5 h-5 rotate-180 text-white/50" />
            </div>
          ) : item.id === 'diia-header' ? (
            <div className="w-full mb-6 pt-2">
              <h1 className="text-[28px] leading-tight font-bold text-gray-900 tracking-tight">
                {item.props?.title || getComponentName(item)}
              </h1>
            </div>
          ) : item.id === 'success-banner' ? (
            <div className="w-full text-center py-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-[#E5F6E8] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-10 h-10 text-[#24A148]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.props?.title || 'Вітаємо!'}</h2>
              <p className="text-gray-500 text-sm leading-relaxed px-4">{item.props?.message || ''}</p>
            </div>
          ) : item.id === 'monobank-payment' || item.id === 'liqpay-payment' ? (
            <div className="w-full p-5 bg-white rounded-[20px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Сума до сплати</div>
                <div className="text-2xl">💳</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{(item.props?.amount / 100).toFixed(2)} ₴</div>
              {item.props?.description && (
                <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">{item.props.description}</div>
              )}
            </div>
          ) : item.id === 'edrfo-api' ? (
            <div className="w-full p-4 bg-white rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">🚗</div>
              <div>
                <div className="font-bold text-gray-900">{item.props?.licensePlate || 'AA1234BB'}</div>
                <div className="text-xs text-gray-500">Державний номер</div>
              </div>
            </div>
          ) : item.id === 'info-card' ? (
            <div className="w-full p-5 bg-white rounded-[20px] shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                {item.props?.icon && <div className="text-xl">{item.props.icon}</div>}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.props?.title || getComponentName(item)}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.props?.text || ''}</p>
                </div>
              </div>
            </div>
          ) : item.id === 'text-input' || item.id === 'number-input' || getComponentName(item).includes('Input') || getComponentName(item).includes('Amount') ? (
            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                {item.props?.label || getComponentName(item)}
              </label>
              <div className="relative">
                <input 
                  type={item.id === 'number-input' ? 'number' : 'text'}
                  readOnly
                  className="w-full px-4 py-4 bg-white border border-[#E5E5E5] rounded-2xl text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  placeholder={item.props?.placeholder || ''}
                  value={item.props?.value || ''}
                />
              </div>
            </div>
          ) : item.id === 'action-button' || getComponentName(item).toLowerCase().includes('button') || getComponentName(item).toLowerCase().includes('послугу') ? (
            <div className="w-full py-4 px-4 bg-black text-white rounded-[20px] flex items-center justify-center font-semibold text-[17px] shadow-lg shadow-black/10 mt-6 active:scale-[0.98] transition-transform">
              {item.props?.text || getComponentName(item)}
            </div>
          ) : item.id === 'chip' ? (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${
              item.props?.variant === 'success' ? 'bg-green-100 text-green-800' :
              item.props?.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              item.props?.variant === 'outline' ? 'border border-gray-300 text-gray-700' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.props?.label || getComponentName(item)}
            </div>
          ) : item.id === 'list-item' ? (
            <div className={`w-full p-4 bg-white border-b border-gray-100 flex items-center justify-between ${
              item.props?.action ? 'active:bg-gray-50 cursor-pointer' : ''
            }`}>
              <div className="flex items-center gap-4">
                {item.props?.icon && <div className="text-xl">{item.props.icon}</div>}
                <div>
                  <div className="font-medium text-gray-900">{item.props?.title || getComponentName(item)}</div>
                  {item.props?.subtitle && <div className="text-xs text-gray-500 mt-0.5">{item.props.subtitle}</div>}
                </div>
              </div>
              {item.props?.action && <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />}
            </div>
          ) : item.id === 'detail-card' ? (
            <div className="w-full bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 mb-4">{item.props?.title || getComponentName(item)}</h3>
              <div className="space-y-3">
                {item.props?.items?.map((detail: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="font-medium text-gray-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full p-4 bg-white rounded-[20px] border border-gray-200 text-center text-sm text-gray-500 border-dashed">
              {getComponentName(item)}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          className="absolute -right-2 -top-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 pointer-events-auto z-10 shadow-sm"
          aria-label="Remove component"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </motion.div>
    )
  }

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
      className="h-full bg-[#F5F5F7] dark:bg-black p-4 md:p-8 overflow-y-auto flex justify-center items-start"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Smartphone Frame - Minimalist */}
      <div className="w-full max-w-[400px] relative flex flex-col">
        
        {/* Device Body */}
        <div className={`
          relative bg-white dark:bg-gray-900 rounded-[48px] border-[8px] border-gray-900 shadow-2xl overflow-hidden transition-all duration-300
          ${isOver ? 'ring-4 ring-blue-500/30 scale-[1.02]' : ''}
        `}>
          {/* Status Bar Area */}
          <div className="h-12 bg-[#F2F2F2] w-full absolute top-0 left-0 z-20 flex justify-between items-center px-6 pt-2">
            <div className="text-xs font-semibold text-gray-900">9:41</div>
            <div className="flex gap-1.5">
              <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]"></div>
              <div className="w-3 h-2.5 bg-gray-900 rounded-[1px]"></div>
              <div className="w-5 h-2.5 border border-gray-900 rounded-[2px] relative">
                <div className="absolute inset-0.5 bg-gray-900"></div>
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a] ml-16"></div>
          </div>
          
          {/* Screen Content */}
          <div className="bg-[#F2F2F2] min-h-[750px] pt-14 pb-8 px-5 relative flex flex-col">
            
            {/* Back Button (Mock) */}
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-base font-medium">Назад</span>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8 border-2 border-dashed border-gray-300 rounded-3xl m-4">
                <span className="text-4xl mb-4 opacity-50">📱</span>
                <p className="text-base font-medium text-gray-500">
                  Перетягніть компоненти сюди
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  Створіть свій перший екран
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-1"
                  >
                    {screens[currentScreen]?.map((item: LegoComponentItem, originalIndex: number) => {
                      // Find original index in items array to ensure stable keys and correct removal
                      const globalIndex = items.findIndex(i => i.uniqueId === item.uniqueId)
                      return renderComponent(item, globalIndex)
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Controls (Outside Phone) */}
        {screens.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrentScreen(prev => Math.max(0, prev - 1))}
              disabled={currentScreen === 0}
              className="p-3 rounded-full bg-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-gray-900"
              aria-label="Previous screen"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {screens.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentScreen ? 'bg-blue-600 w-4' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentScreen(prev => Math.min(screens.length - 1, prev + 1))}
              disabled={currentScreen === screens.length - 1}
              className="p-3 rounded-full bg-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-gray-900"
              aria-label="Next screen"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
        
        {/* Execute Button (Outside Phone) */}
        {items.length > 0 && onExecute && (
          <div className="mt-6 px-4">
            <button
              onClick={onExecute}
              disabled={isExecuting}
              className="w-full bg-gradient-to-r from-[#2F2F2F] to-[#000000] text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Обробка...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Запустити прототип</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Натисніть, щоб протестувати повний флоу
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
