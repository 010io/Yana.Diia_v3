'use client'

export default function Mission() {
  return (
    <section id="mission" className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Основна ідея</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Yana.Diia призначена для внутрішнього використання продуктовими командами, аналітиками, дизайнерами й менеджерами проєктів Мінцифри, EPAM та партнерських GovTech-команд.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass p-6 rounded-xl space-y-3">
            <h3 className="font-semibold text-foreground text-lg">Вхід системи</h3>
            <p className="text-muted-foreground">
              Текстовий опис BRD або структури послуги
            </p>
          </div>
          <div className="glass p-6 rounded-xl space-y-3">
            <h3 className="font-semibold text-foreground text-lg">Вихід системи</h3>
            <p className="text-muted-foreground">
              Варіанти покрокових user-flow згідно з дизайн-системою Дія та готові JSON-маршрути для рев'ю
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <h3 className="font-semibold text-foreground">Критерії ранжування</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg hover:bg-white/10 transition duration-300">
              <p className="text-sm text-muted-foreground">✓ Мінімальна кількість кроків</p>
            </div>
            <div className="glass p-4 rounded-lg hover:bg-white/10 transition duration-300">
              <p className="text-sm text-muted-foreground">✓ Максимальна відповідність дизайн-системі</p>
            </div>
            <div className="glass p-4 rounded-lg hover:bg-white/10 transition duration-300">
              <p className="text-sm text-muted-foreground">✓ Відсутність нестандартних компонентів</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
