'use client'

import { Mail, Github, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Contacts() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 md:p-12 rounded-2xl space-y-8 border-t border-primary/30">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Контакти & Соціальні медіа</h2>
            <p className="text-lg text-muted-foreground">Приєднайтесь до спільноти та слідкуйте за розвитком</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a href="https://github.com/V2473/BeTransparent" target="_blank" rel="noopener noreferrer" className="glass p-6 rounded-xl hover:bg-white/10 transition flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center group-hover:from-primary/50 group-hover:to-accent/50 transition">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">GitHub</p>
                <p className="text-sm text-muted-foreground">github.com/V2473/BeTransparent</p>
              </div>
            </a>

            <a href="mailto:team@yandia.gov.ua" className="glass p-6 rounded-xl hover:bg-white/10 transition flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center group-hover:from-accent/50 group-hover:to-primary/50 transition">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">team@yandia.gov.ua</p>
              </div>
            </a>

            <a href="https://t.me/yanadiia" target="_blank" rel="noopener noreferrer" className="glass p-6 rounded-xl hover:bg-white/10 transition flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center group-hover:from-primary/50 group-hover:to-accent/50 transition">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Telegram</p>
                <p className="text-sm text-muted-foreground">@yanadiia (бот & канал)</p>
              </div>
            </a>

            <a href="https://twitter.com/yandia" target="_blank" rel="noopener noreferrer" className="glass p-6 rounded-xl hover:bg-white/10 transition flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center group-hover:from-accent/50 group-hover:to-primary/50 transition">
                <ExternalLink className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Twitter/X</p>
                <p className="text-sm text-muted-foreground">@yandia</p>
              </div>
            </a>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg shadow-lg shadow-primary/30">
              Розпочати з Яною
            </Button>
            <Button className="bg-white/5 border border-white/20 hover:bg-white/10 text-foreground backdrop-blur-sm rounded-lg">
              Переглянути документацію
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
