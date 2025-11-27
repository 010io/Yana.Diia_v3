'use client'

import { useState, useEffect } from 'react'
import { componentRegistry, LegoComponent } from '@/lib/lego/component-registry'

interface PropertyEditorProps {
  selectedItem: any | null
  onUpdate: (itemId: number, updates: any) => void
}

export function PropertyEditor({ selectedItem, onUpdate }: PropertyEditorProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({})

  // Get component definition
  const component = selectedItem 
    ? componentRegistry.get(selectedItem.id) 
    : null

  // Initialize local config when item changes
  useEffect(() => {
    if (selectedItem) {
      setLocalConfig(selectedItem.config || {})
    }
  }, [selectedItem])

  if (!selectedItem || !component) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg">⚙️ Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
          Select a component to edit its properties
        </div>
      </div>
    )
  }

  const handleChange = (propName: string, value: any) => {
    const updated = { ...localConfig, [propName]: value }
    setLocalConfig(updated)
    onUpdate(selectedItem.uniqueId, { config: updated })
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-2">⚙️ Properties</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{component.icon}</span>
          <div>
            <h3 className="font-medium text-sm">{component.name}</h3>
            <p className="text-xs text-gray-500">{component.category}</p>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Component Description */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            {component.description}
          </p>
        </div>

        {/* API Provider Info */}
        {component.apiProvider && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-green-900 dark:text-green-100">
                🔌 API Provider
              </span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {component.apiProvider}
            </p>
            {component.apiEndpoint && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                {component.apiEndpoint}
              </p>
            )}
          </div>
        )}

        {/* Editable Properties */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase">Configuration</h4>
          
          {Object.entries(component.props).map(([propName, propDef]) => (
            <div key={propName} className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                {propName}
                {propDef.required && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </label>
              
              {propDef.description && (
                <p className="text-xs text-gray-500">{propDef.description}</p>
              )}

              {/* Input based on type */}
              {propDef.type === 'string' && (
                <input
                  type="text"
                  value={localConfig[propName] || propDef.default || ''}
                  onChange={(e) => handleChange(propName, e.target.value)}
                  placeholder={propDef.default || `Enter ${propName}`}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                />
              )}

              {propDef.type === 'number' && (
                <input
                  type="number"
                  value={localConfig[propName] || propDef.default || 0}
                  onChange={(e) => handleChange(propName, parseFloat(e.target.value))}
                  placeholder={propDef.default?.toString() || '0'}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                />
              )}

              {propDef.type === 'boolean' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig[propName] || propDef.default || false}
                    onChange={(e) => handleChange(propName, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    {localConfig[propName] ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              )}

              {propDef.type === 'object' && (
                <textarea
                  value={JSON.stringify(localConfig[propName] || propDef.default || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      handleChange(propName, JSON.parse(e.target.value))
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={4}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono"
                />
              )}
            </div>
          ))}

          {Object.keys(component.props).length === 0 && (
            <p className="text-xs text-gray-400 italic">
              No configurable properties
            </p>
          )}
        </div>

        {/* Documentation Link */}
        {component.metadata.documentation && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <a
              href={component.metadata.documentation}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              📚 View Documentation
              <span>→</span>
            </a>
          </div>
        )}

        {/* Tags */}
        {component.metadata.tags.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {component.metadata.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
