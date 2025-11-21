'use client'

import { Github, Mail, Linkedin } from 'lucide-react'

const teamMembers = [
  {
    name: 'Volodymyr Seferov',
    role: 'Капітан, Backend/DevOps',
    email: 'vovasef@gmail.com',
    github: 'V2473',
    description: 'Full-stack розробник, AWS/Vercel, FastAPI архітектура'
  },
  {
    name: 'Наталія Ільчук',
    role: 'AI Спеціалістка, PM',
    email: 'ilchuknatalia92_ai@hackathon',
    github: 'nataliiailchuk',
    description: 'AI-архітекторка систем, продакт-аналітика, LLM інтеграції'
  },
  {
    name: 'Ігор Омельченко',
    role: 'Backend-розробник',
    email: 'igoromelchenkooleksandrovich_ai@hackathon',
    github: '010io',
    description: 'Python/FastAPI експерт, API інтеграції, база даних'
  },
  {
    name: 'Дарія Шевчук',
    role: 'Frontend-розробник, QA',
    email: 'dashashevchuk2015_ai@hackathon',
    github: 'dariashevchuk',
    description: 'React/Next.js, UI/UX, тестування, мануальний QA'
  },
  {
    name: 'Bogdan Paranytsia',
    role: 'Senior Developer',
    email: 'bogdan@example.com',
    github: 'susanin',
    description: 'DevOps, інфраструктура, масштабування'
  },
  {
    name: '_ primarch_',
    role: 'Lead Developer, Architecture',
    email: 'primarch@example.com',
    github: 'primarch',
    description: 'Система архітектури, LLM агенти, AI моделі'
  }
]

export default function Team() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Команда Be Transparent
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Експерти в AI, розробці та державних технологіях, об'єднані місією зробити цифрову Україну прозорішою
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass p-6 rounded-xl border border-primary/20 hover:border-accent/50 transition space-y-4 group">
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                </div>
                
                <p className="text-sm text-muted-foreground">{member.description}</p>

                <div className="flex gap-3 pt-2">
                  {member.github && (
                    <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" 
                       className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition group-hover:border-primary/50 border border-white/10">
                      <Github className="w-4 h-4 text-foreground" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} 
                       className="w-9 h-9 rounded-lg bg-white/5 hover:bg-accent/20 flex items-center justify-center transition group-hover:border-accent/50 border border-white/10">
                      <Mail className="w-4 h-4 text-foreground" />
                    </a>
                  )}
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition group-hover:border-primary/50 border border-white/10">
                    <Linkedin className="w-4 h-4 text-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-8 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-foreground mb-3">Про команду</h3>
              <p className="text-muted-foreground leading-relaxed">
                Be Transparent — команда, що складається з експертів у галузі AI, розробки та державних технологій. 
                Ми створили Yana.Diia для Diia.AI Hackathon, щоб автоматизувати та прискорити розробку електронних послуг в Україні. 
                Наша місія — зробити розробку державних сервісів швидшою, якіснішою й прозорішою.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
