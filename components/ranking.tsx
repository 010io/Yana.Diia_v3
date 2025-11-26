'use client'

import { Zap, Palette, Accessibility, Sparkles, BarChart3, Target } from 'lucide-react'

export default function Ranking() {
  const criteria = [
    { 
      icon: Zap, 
      title: 'Мінімум кроків', 
      desc: 'Найкоротший шлях для користувача' 
    },
    { 
      icon: Palette, 
      title: 'Design System', 
      desc: 'Максимальна відповідність Дія' 
    },
    { 
      icon: Accessibility, 
      title: 'Доступність', 
      desc: 'WCAG & inclusivity стандарти' 
    },
    { 
      icon: Sparkles, 
      title: 'Якість', 
      desc: 'Без застарілих компонентів' 
    },
    { 
      icon: BarChart3, 
      title: 'Аналітика', 
      desc: 'Open data insights' 
    },
    { 
      icon: Target, 
      title: 'Персоналізація', 
      desc: 'Контекст для домену' 
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Критерії ранжування</h2>
          </div>
          <p className="text-lg text-muted-foreground">Як Yana.Diia обирає найкращий flow для вас</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criteria.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="glass p-6 rounded-xl hover:bg-white/10 transition group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
