'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, ChevronRight } from 'lucide-react'

const phases = [
  {
    phase: 'Phase 1: Foundation',
    timeline: 'Тиждень 1 (16-22 листопада)',
    status: 'in-progress',
    tasks: [
      { name: 'Clone diia-open-source repos', done: true },
      { name: 'Setup RAG база (FAISS/ChromaDB)', done: true },
      { name: 'GitHub MCP інтеграція', done: true },
      { name: 'Парсинг iOS/Android компонентів', done: false }
    ]
  },
  {
    phase: 'Phase 2: Core Functionality',
    timeline: 'Тиждень 2 (23-29 листопада)',
    status: 'upcoming',
    tasks: [
      { name: 'FastAPI backend з REST endpoints', done: false },
      { name: 'LLM інтеграція (Claude/GPT-4)', done: false },
      { name: 'Pydantic validation schema', done: false },
      { name: 'Next.js frontend + real-time updates', done: false }
    ]
  },
  {
    phase: 'Phase 3: Production Features',
    timeline: 'Тиждень 3',
    status: 'upcoming',
    tasks: [
      { name: 'HITL Review Interface', done: false },
      { name: 'Export функції (JSON, Confluence, Figma)', done: false },
      { name: 'Smart notifications', done: false },
      { name: 'Analytics dashboard', done: false }
    ]
  }
]

export default function IntegrationRoadmap() {
  return (
    <section id="integration-roadmap" className="py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Roadmap Інтеграцій
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Структурований план розвитку з фокусом на реальні API та MCP інтеграції
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, idx) => (
            <Card key={phase.phase} className="glass border-white/10 p-8 rounded-xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{phase.phase}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {phase.timeline}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  phase.status === 'in-progress' ? 'bg-accent/20 text-accent' :
                  'bg-muted/20 text-muted-foreground'
                }`}>
                  {phase.status === 'in-progress' ? '🔄 У розробці' : '⏳ Майбутнє'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {phase.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-border/30 hover:border-border/50 transition">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                      task.done ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                    <span className={`text-sm ${
                      task.done ? 'text-foreground line-through opacity-50' : 'text-foreground'
                    }`}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <h4 className="font-bold text-foreground text-lg mb-4">Ключові технологічні стеки:</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-primary uppercase mb-3">Frontend</p>
              <p className="text-foreground">Next.js 16, React 19, TypeScript, Tailwind CSS v4, SWR для data fetching</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary uppercase mb-3">Backend</p>
              <p className="text-foreground">FastAPI, Python 3.11+, Pydantic, SQLAlchemy, PostgreSQL</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent uppercase mb-3">AI/LLM</p>
              <p className="text-foreground">Anthropic Claude, OpenAI GPT-4, Instructor для structured output</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent uppercase mb-3">Data/RAG</p>
              <p className="text-foreground">FAISS/ChromaDB, Tree-sitter (Swift/Kotlin parsing), sentence-transformers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
