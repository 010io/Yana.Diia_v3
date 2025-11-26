'use client'

import { Layers, Filter, Brain, Zap, CheckCircle, Share2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function LLMOpsArchitecture() {
  const layers = [
    {
      number: 1,
      name: 'Generation Layer',
      description: 'LLM генерує N варіантів flow з BRD → JSON',
      icon: Brain,
      color: 'from-primary/20 to-primary/5'
    },
    {
      number: 2,
      name: 'Validation Layer',
      description: 'Pydantic + Instructor валідує JSON, retry при помилках',
      icon: CheckCircle,
      color: 'from-accent/20 to-accent/5'
    },
    {
      number: 3,
      name: 'Evaluation Layer',
      description: 'FlowEvaluator оцінює Logic, Design Compliance, Completeness, Minimality',
      icon: Brain,
      color: 'from-primary/20 to-primary/5'
    },
    {
      number: 4,
      name: 'Optimization Layer',
      description: 'ABN Testing: порівняння N варіантів, вибір Champion з Rationale',
      icon: Zap,
      color: 'from-accent/20 to-accent/5'
    },
    {
      number: 5,
      name: 'Service Layer',
      description: 'API (generate, evaluate) + Trace ID + Human-in-the-Loop',
      icon: Share2,
      color: 'from-primary/20 to-primary/5'
    }
  ]

  return (
    <section id="llmops" className="py-20 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 text-balance text-pretty">
          5-рівнева LLMOps Архітектура
        </h2>
        <p className="text-lg text-muted-foreground">
          Комплексна система для генерування, валідації та оптимізації user-flow
        </p>
      </div>

      <div className="space-y-4">
        {layers.map((layer) => {
          const IconComponent = layer.icon
          return (
            <div key={layer.number} className="group">
              <Card className="relative overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 bg-gradient-to-r opacity-90 hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-r ${layer.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6 flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-primary">Layer {layer.number}</span>
                      <h3 className="text-xl font-bold text-foreground">{layer.name}</h3>
                    </div>
                    <p className="text-muted-foreground">{layer.description}</p>
                  </div>

                  {layer.number < 5 && (
                    <div className="flex-shrink-0 text-primary/40 mt-1">
                      <div className="h-6 w-0.5 bg-gradient-to-b from-primary/40 to-transparent" />
                    </div>
                  )}
                </div>
              </Card>
              
              {layer.number < 5 && (
                <div className="flex justify-center py-2">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-primary/20 to-transparent" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-12 p-6 rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Процес у цифрах
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Варіантів на вихід</p>
            <p className="text-2xl font-bold text-primary">N ≥ 3</p>
          </div>
          <div>
            <p className="text-muted-foreground">Критеріїв оцінки</p>
            <p className="text-2xl font-bold text-accent">4</p>
          </div>
          <div>
            <p className="text-muted-foreground">Форматів експорту</p>
            <p className="text-2xl font-bold text-primary">JSON, Figma, Jira</p>
          </div>
          <div>
            <p className="text-muted-foreground">Вага кожного критерію</p>
            <p className="text-sm text-muted-foreground">30%, 30%, 20%, 20%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
