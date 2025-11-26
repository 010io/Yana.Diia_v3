'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Copy, Check, Upload, AlertCircle, HelpCircle } from 'lucide-react'

const mockDemoFlow = {
  flow: {
    name: "Document Upload Service",
    steps: [
      { step_id: 1, screen_name: "Welcome Screen", action: "show_welcome" },
      { step_id: 2, screen_name: "File Upload", action: "upload_documents" },
      { step_id: 3, screen_name: "Validation", action: "validate_docs" },
      { step_id: 4, screen_name: "ESID Save", action: "save_to_esid" }
    ]
  },
  scores: {
    logic: 8.5,
    design: 9.0,
    completeness: 8.7,
    minimality: 9.2,
    total: 8.85
  }
}

export default function LiveDemo() {
  const [brdText, setBrdText] = useState('Користувач хоче подати документи онлайн\nПотрібна можливість завантажити файли\nВалідація документів\nЗбереження в ЕСІД')
  const [flowOutput, setFlowOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [scores, setScores] = useState<any>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleGenerateFlow = async () => {
    setIsLoading(true)
    setError('')
    setFlowOutput('')
    setScores(null)
    setIsDemoMode(false)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          brd: brdText, 
          numVariants: 1 
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      const championVariant = data.variants.find((v: any) => v.variant_id === data.champion)
      
      setFlowOutput(JSON.stringify(championVariant.flow, null, 2))
      setScores({
        logic: championVariant.logic_score,
        design: championVariant.design_score,
        completeness: championVariant.completeness_score,
        minimality: championVariant.minimality_score,
        total: championVariant.total_score
      })
    } catch (err) {
      console.error('[v0] Generation error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Generation failed'
      setError(errorMsg)
      
      if (errorMsg.includes('Backend') || errorMsg.includes('cannot reach')) {
        setIsDemoMode(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    setFlowOutput(JSON.stringify(mockDemoFlow.flow, null, 2))
    setScores(mockDemoFlow.scores)
    setError('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(flowOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="live-demo" className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Спробуй Live Demo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Введи опис послуги (BRD) та отримай готовий JSON-flow за секунди
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="glass border-white/10 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Введи BRD чи опис послуги</h3>
              </div>
              
              <textarea
                value={brdText}
                onChange={(e) => setBrdText(e.target.value)}
                className="w-full h-48 bg-background/50 border border-border/30 rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                placeholder="Опиши послугу, яку потрібно автоматизувати..."
              />
              
              <Button
                onClick={handleGenerateFlow}
                disabled={isLoading || !brdText.trim()}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                    Генерую flow...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Генерувати Flow
                  </span>
                )}
              </Button>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  {isDemoMode && (
                    <Button
                      onClick={handleDemoMode}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs border-red-500/50 hover:bg-red-500/10"
                    >
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Try Demo Mode Instead
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Output */}
          <Card className="glass border-white/10 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-primary to-accent rounded-full" />
                  JSON Flow Output
                  {isDemoMode && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Demo</span>}
                </h3>
                {flowOutput && (
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
              
              <pre className="w-full h-48 bg-background/50 border border-border/30 rounded-lg p-4 text-xs text-muted-foreground overflow-auto font-mono">
                {flowOutput || '// Flow буде відображатися тут...'}
              </pre>

              {scores && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <span className="text-muted-foreground">Logic Score</span>
                    <p className="text-primary font-semibold">{scores.logic.toFixed(1)}/10</p>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <span className="text-muted-foreground">Design Score</span>
                    <p className="text-accent font-semibold">{scores.design.toFixed(1)}/10</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <span className="text-muted-foreground">Completeness</span>
                    <p className="text-primary font-semibold">{scores.completeness.toFixed(1)}/10</p>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <span className="text-muted-foreground">Total Score</span>
                    <p className="text-accent font-semibold">{scores.total.toFixed(2)}/10</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl">
          <p className="text-sm text-muted-foreground text-center">
            Для реальної генерації запусти backend: див. BACKEND_SETUP.md
            <br />
            Або використай Demo Mode для швидкого перегляду можливостей
          </p>
        </div>
      </div>
    </section>
  )
}
