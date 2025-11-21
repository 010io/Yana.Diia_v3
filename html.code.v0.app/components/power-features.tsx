'use client'

import { Brain, Mic, Zap, Shield, GitBranch, Eye, MessageCircle } from 'lucide-react'

export default function PowerFeatures() {
  const powerFeatures = [
    {
      icon: Brain,
      title: 'AI-парсинг BRD',
      desc: 'Багатомодельний LLM-рушій (ChatGPT, Qwen 2.5, Gemma3, ollama)',
    },
    {
      icon: Shield,
      title: 'Chrome-розширення',
      desc: 'Захоплення даних з Дія, структуроване надсилання в 1 клік',
    },
    {
      icon: MessageCircle,
      title: 'Публічний фідбек',
      desc: 'Модуль голосування з антифродом (BERT, rule-based, multilang)',
    },
    {
      icon: Mic,
      title: 'Multimodal input',
      desc: 'Drag&drop, OCR, speech-to-text, vision transformer',
    },
    {
      icon: GitBranch,
      title: 'DevOps-ready',
      desc: 'REST API, інтеграція з Jira, Confluence, GitHub, CI/CD',
    },
    {
      icon: Eye,
      title: 'Transparency',
      desc: 'Відкритий лог змін, explainable AI, auto-генерація пояснень',
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Power Features</h2>
          </div>
          <p className="text-lg text-muted-foreground">Найпотужніші можливості для команд</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {powerFeatures.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="group glass p-6 rounded-xl hover:border-primary/50 hover:bg-white/10 transition">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 group-hover:from-primary/50 group-hover:to-accent/50 transition">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
