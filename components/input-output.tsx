'use client'

import { Upload, ArrowRight, FileJson, CheckCircle, FileText, Headphones, Image, FileCode } from 'lucide-react'

export default function InputOutput() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Як працює Yana.Diia</h2>
          <p className="text-lg text-muted-foreground">Прості і потужні цикли обробки даних</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* Input */}
          <div className="glass p-8 rounded-2xl space-y-6 hover:border-primary/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground text-lg">Вхід</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Текстовий опис BRD</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Mindmap та структури</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Голос, картинки, PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Figma та JSON-схеми</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex justify-center">
            <ArrowRight className="w-8 h-8 text-accent animate-pulse" />
          </div>

          {/* Output */}
          <div className="glass p-8 rounded-2xl space-y-6 hover:border-accent/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
              <FileJson className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileJson className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground text-lg">Вихід</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Варіанти user-flow</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>JSON-маршрути</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Wireframes & прототипи</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Рекомендації для Figma</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
