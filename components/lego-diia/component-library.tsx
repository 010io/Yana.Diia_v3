'use client'

import { useState } from 'react'
import componentsData from '@/config/diia-components.json'

interface ComponentLibraryProps {
  onDragStart: (componentId: string) => void
}

export function ComponentLibrary({ onDragStart }: ComponentLibraryProps) {
  const [filter, setFilter] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  
  const categories = ['all', ...Array.from(new Set(componentsData.map(c => c.category)))]
  
  const filteredComponents = componentsData.filter(c => {
    const matchesFilter = c.name.toLowerCase().includes(filter.toLowerCase())
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory
    return matchesFilter && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-4">📚 Components</h2>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search components..."
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredComponents.map(component => (
          <div
            key={component.id}
            draggable
            onDragStart={() => onDragStart(component.id)}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 cursor-grab active:cursor-grabbing bg-gray-50 dark:bg-gray-800/50 transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg">
                {/* Placeholder icon based on category */}
                {component.category === 'auth' ? '🔐' : 
                 component.category === 'form' ? '📝' : 
                 component.category === 'layout' ? '📐' : '📦'}
              </div>
              <div>
                <h3 className="font-medium text-sm">{component.name}</h3>
                <p className="text-xs text-gray-500">{component.category}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400">
                ⋮
              </div>
            </div>
          </div>
        ))}
        
        {filteredComponents.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No components found
          </div>
        )}
      </div>
    </div>
  )
}
