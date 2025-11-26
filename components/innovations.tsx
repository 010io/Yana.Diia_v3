'use client'

import { MessageSquare, Code, Lightbulb, Users, Palette, Zap } from 'lucide-react'

export default function Innovations() {
  const innovations = [
    {
      icon: MessageSquare,
      title: 'Feedback Hub',
      desc: 'Публічний канал для ідей громадян з auto-аналізом дублювання',
    },
    {
      icon: Code,
      title: 'Instant Wireframes',
      desc: 'Auto-wireframes у браузері, експорт у Figma/PNG/SVG',
    },
    {
      icon: Lightbulb,
      title: 'Smart FAQ',
      desc: 'Голосова навігація з поясненнями "чому цей флоу не проходить"',
    },
    {
      icon: Users,
      title: 'Team Co-editing',
      desc: 'Багатокористувацький канвас з live-коментарями як у Figma',
    },
    {
      icon: Palette,
      title: 'AI-дошка натхнення',
      desc: 'Best practices з інших govtech рішень, генерація альтернатив',
    },
    {
      icon: Zap,
      title: 'Fast Dev Sandbox',
      desc: 'Тестування локальних LLM, кастомні сценарії для PoC',
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lightbulb className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Додаткові інновації</h2>
          </div>
          <p className="text-lg text-muted-foreground">Ідеї команди Be Transparent для майбутнього</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="group glass p-6 rounded-xl hover:border-accent/50 hover:bg-white/10 transition">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4 group-hover:from-accent/50 group-hover:to-primary/50 transition">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
