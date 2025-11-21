'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '0.5s'}} />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent">Diia.AI Hackathon — команда Be Transparent</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
          AI для цифрових{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">архітекторів України</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
          Yana.Diia прискорює розробку e-сервісів з 2–5 днів до 1–2 годин за рахунок автоматизації аналітично-дизайнерських завдань
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-lg">
            Розпочати демо <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" className="bg-white/5 border border-white/20 hover:bg-white/10 text-foreground backdrop-blur-sm rounded-lg shadow-lg">
            Документація
          </Button>
        </div>
      </div>
    </section>
  )
}
