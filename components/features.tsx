'use client'

import { Brain, Chrome, Shield, Filter, Zap, Code } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-парсинг BRD',
      description: 'Використання LLM для автоматизованого парсингу BRD і багатоваріантної генерації user-flow'
    },
    {
      icon: Chrome,
      title: 'Chrome-розширення',
      description: 'Інтегруйте Яну у власні робочі процеси без прив\'язки до Figma або пропрієтарних платформ'
    },
    {
      icon: Shield,
      title: 'REST API',
      description: 'Відкритий API для інтеграції з вашими системами та розробки власних рішень'
    },
    {
      icon: Filter,
      title: 'Фільтрація відгуків',
      description: 'Базові фільтри для антиспаму, дублікатів та модуль агрегації зворотного зв\'язку'
    },
    {
      icon: Zap,
      title: 'Швидкий прототипування',
      description: 'Прототипи нових послуг за лічені години замість днів розробки'
    },
    {
      icon: Code,
      title: 'JSON-маршрути',
      description: 'Готові структуровані маршрути для автоматичної интеграції та розгортання'
    }
  ]

  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Можливості</h2>
          <p className="text-lg text-muted-foreground">
            Повний набір інструментів для сучасних GovTech-команд
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="group glass p-6 rounded-xl hover:bg-white/10 hover:border-white/20 transition duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 group-hover:from-primary/50 group-hover:to-accent/50 transition">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
