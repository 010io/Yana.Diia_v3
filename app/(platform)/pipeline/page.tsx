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
            <h3 className="font-bold mb-4">Structured Data (JSON)</h3>
            <pre className="font-mono text-sm overflow-auto max-h-[500px] text-green-600 dark:text-green-400">
              {JSON.stringify(parsedBRD, null, 2)}
            </pre>
          </div>
        )}

        {/* Flows Tab */}
        {activeTab === 'flows' && flows.length > 0 && (
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
                  {flow.steps.map((step, i) => (
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
                  <button className="text-blue-500 hover:underline">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
