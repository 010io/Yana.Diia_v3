'use client'

import { Lock, Shield, Eye } from 'lucide-react'

export default function Principles() {
  const principles = [
    {
      icon: Lock,
      title: 'Privacy by Design',
      items: [
        'Внутрішня обробка даних',
        'Ізольованість від користувачів',
        'Pseudonymization & верифікація',
      ]
    },
    {
      icon: Shield,
      title: 'Security First',
      items: [
        'Тільки перевірені модулі',
        'Рольова авторизація backend',
        'Незалежний аудит & пентест',
      ]
    },
    {
      icon: Eye,
      title: 'Transparency',
      items: [
        'Відкритий код на GitHub',
        'REST-API на Swagger',
        'Логування усіх змін',
      ]
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Принципи розробки</h2>
          </div>
          <p className="text-lg text-muted-foreground">Орієнтир на безпеку, приватність та прозорість</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {principles.map((principle, idx) => {
            const Icon = principle.icon
            return (
              <div key={idx} className="glass p-8 rounded-xl border-l-4 border-accent hover:border-primary transition">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-4 text-lg">{principle.title}</h3>
                <ul className="space-y-2">
                  {principle.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
