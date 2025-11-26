'use client'

import { ExternalLink, Code2, Database, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DiaIntegrations() {
  const integrations = [
    {
      name: 'Gateway Service',
      description: 'HTTP шлюз та основне API для доступу до всіх Diia сервісів',
      repo: 'be-gateway-service',
      stars: 45,
      link: 'https://github.com/diia-open-source/be-gateway-service',
      tech: ['TypeScript', 'REST API', 'MongoDB'],
      icon: Zap,
    },
    {
      name: 'Documents Service',
      description: 'Управління та отримання цифрових документів громадян',
      repo: 'be-documents-service',
      stars: 6,
      link: 'https://github.com/diia-open-source/be-documents-service',
      tech: ['TypeScript', 'gRPC', 'Crypto'],
      icon: Database,
    },
    {
      name: 'Public Service Catalog',
      description: 'Каталог державних послуг та їх структурування',
      repo: 'be-public-service-catalog',
      stars: 6,
      link: 'https://github.com/diia-open-source/be-public-service-catalog',
      tech: ['TypeScript', 'MongoDB', 'API'],
      icon: Code2,
    },
    {
      name: 'User Service',
      description: 'Управління користувачами та їх профілями',
      repo: 'be-user-service',
      stars: 137,
      link: 'https://github.com/diia-open-source/be-user-service',
      tech: ['TypeScript', 'Auth', 'Database'],
      icon: Database,
    },
    {
      name: 'Diia Logger',
      description: 'Централізоване логування для всіх мікросервісів',
      repo: 'be-diia-logger',
      stars: 9,
      link: 'https://github.com/diia-open-source/be-diia-logger',
      tech: ['TypeScript', 'Logging', 'Monitoring'],
      icon: Zap,
    },
    {
      name: 'Utils & Types',
      description: 'Спільні утиліти, типи та конфігурація для Diia стеку',
      repo: 'be-pkg-utils',
      stars: 14,
      link: 'https://github.com/diia-open-source/be-pkg-utils',
      tech: ['TypeScript', 'Utilities', 'Types'],
      icon: Code2,
    },
  ]

  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Diia Open Source Інтеграції
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Yana.Diia працює з реальними API та мікросервісами від diia-open-source, генеруючи flow на основі актуальної архітектури Diia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, idx) => {
            const Icon = integration.icon
            return (
              <Card 
                key={idx}
                className="glass group hover:border-accent/50 hover:bg-white/[0.08] transition-all duration-300 flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-xs bg-background/40 px-2 py-1 rounded-full text-muted-foreground">
                      ★ {integration.stars}
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2">
                    {integration.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6 flex-1">
                    {integration.tech.map((tech, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/20">
                    <a 
                      href={integration.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition font-medium"
                    >
                      {integration.repo}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 glass rounded-xl p-8 border border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                API Reference
              </h3>
              <p className="text-muted-foreground mb-6">
                Yana.Diia аналізує API структури з OpenAPI/Swagger документації та генерує оптимізовані user flow з врахуванням можливостей кожного сервісу.
              </p>
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <a href="https://github.com/diia-open-source" target="_blank" rel="noopener noreferrer">
                  Переглянути все на GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Використання
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground font-mono">
                <p>// 1. Парсинг BRD описаного с користуванням Diia API</p>
                <p>// 2. Автоматичне маппування на доступні endpoints</p>
                <p>// 3. Генерація flow з оптимальним路徑</p>
                <p>// 4. Експорт JSON для Figma/React компонентів</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
