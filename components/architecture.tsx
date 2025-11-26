'use client'

export default function Architecture() {
  return (
    <section id="architecture" className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Архітектурні акценти</h2>
          <p className="text-lg text-muted-foreground">
            Система побудована на публічних даних з можливістю розширення для production-бізнесу
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs flex items-center justify-center font-bold shadow-lg shadow-primary/20">1</span>
                Публічні дані
              </h3>
              <p className="text-sm text-muted-foreground ml-11">
                Дизайн-система Дія, відкриті списки сервісів, open-source-репозиторії, BRD шаблони, результати веб-пошуку
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-primary-foreground text-xs flex items-center justify-center font-bold shadow-lg shadow-accent/20">2</span>
                Мультимодальні інтерфейси
              </h3>
              <p className="text-sm text-muted-foreground ml-11">
                Текст, голос, скріншоти, PDF та структуровані документи
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs flex items-center justify-center font-bold shadow-lg shadow-primary/20">3</span>
                Агентно-орієнтований режим
              </h3>
              <p className="text-sm text-muted-foreground ml-11">
                Pipeline з взаємодією підмодулів, інтеграція з DevOps-процесами (Jira, Confluence, Git)
              </p>
            </div>
          </div>

          <div className="glass p-8 rounded-xl space-y-4 border-l-2 border-accent">
            <h3 className="font-semibold text-foreground mb-6 text-lg">Принципи розробки</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-foreground text-sm">Privacy by Design</p>
                  <p className="text-xs text-muted-foreground">Жоден ризик для приватності користувачів</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 bg-gradient-to-b from-accent to-primary rounded-full flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-foreground text-sm">Security First</p>
                  <p className="text-xs text-muted-foreground">Відповідність вимогам Дія</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-foreground text-sm">Transparency</p>
                  <p className="text-xs text-muted-foreground">Open-source розробка та документація</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
