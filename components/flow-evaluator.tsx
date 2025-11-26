'use client'

import { BarChart3, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function FlowEvaluator() {
  const metrics = [
    {
      name: 'Logic Score',
      weight: '30%',
      description: 'Логічність переходів між екранами, правильність flow',
      color: 'text-blue-400'
    },
    {
      name: 'Design Compliance',
      weight: '30%',
      description: 'Відповідність офіційній дизайн-системі Дія',
      color: 'text-purple-400'
    },
    {
      name: 'Completeness',
      weight: '20%',
      description: 'Чи всі вимоги з BRD покриті в flow',
      color: 'text-green-400'
    },
    {
      name: 'Steps Minimality',
      weight: '20%',
      description: 'Оптимальність UX (мінімум екранів без втрати функціональності)',
      color: 'text-yellow-400'
    }
  ]

  const variants = [
    { id: 'v1', logic: 9.5, design: 10.0, complete: 9.0, minimal: 10.0, total: 9.75, champion: true },
    { id: 'v2', logic: 8.0, design: 7.5, complete: 9.0, minimal: 6.0, total: 7.95, champion: false },
    { id: 'v3', logic: 5.5, design: 2.0, complete: 8.5, minimal: 7.5, total: 5.4, champion: false }
  ]

  return (
    <section id="evaluator" className="py-20 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 text-balance text-pretty">
          FlowEvaluator: LLM-as-a-Judge
        </h2>
        <p className="text-lg text-muted-foreground">
          Автоматична оцінка якості flow за 4 критеріями з використанням G-Eval та RAG
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Метрики */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Критерії оцінки
          </h3>
          
          {metrics.map((metric, i) => (
            <Card key={i} className="p-4 border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{metric.name}</h4>
                <span className="text-sm font-bold text-primary">{metric.weight}</span>
              </div>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
              <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{width: metric.weight}} />
              </div>
            </Card>
          ))}
        </div>

        {/* Scorecard */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            ABN Testing: Порівняння варіантів
          </h3>
          
          <Card className="p-6 border border-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-semibold">Варіант</th>
                  <th className="text-center py-2 px-2 font-semibold">Logic</th>
                  <th className="text-center py-2 px-2 font-semibold">Design</th>
                  <th className="text-center py-2 px-2 font-semibold">Complete</th>
                  <th className="text-center py-2 px-2 font-semibold">Minimal</th>
                  <th className="text-right py-2 px-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr 
                    key={v.id} 
                    className={`border-b border-border/50 ${v.champion ? 'bg-primary/10' : ''} hover:bg-primary/5 transition-colors`}
                  >
                    <td className="py-3 px-2 font-semibold">
                      {v.champion && <span className="text-accent">⭐ </span>}
                      {v.id}
                    </td>
                    <td className="text-center py-3 px-2">{v.logic}</td>
                    <td className="text-center py-3 px-2">{v.design}</td>
                    <td className="text-center py-3 px-2">{v.complete}</td>
                    <td className="text-center py-3 px-2">{v.minimal}</td>
                    <td className="text-right py-3 px-2">
                      <span className={`font-bold ${v.champion ? 'text-accent' : 'text-foreground'}`}>
                        {v.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          
          <p className="text-xs text-muted-foreground mt-3">
            <span className="text-accent font-semibold">v1 — Champion</span> рекомендується для впровадження
          </p>
        </div>
      </div>
    </section>
  )
}
