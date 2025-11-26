'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/30 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/10 backdrop-blur-sm -z-10" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-sm">Я</span>
              </div>
              <span className="font-bold text-foreground">Yana.Diia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI для цифрових архітекторів України
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Проект</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition">Про Яну</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition">Документація</Link></li>
              <li><Link href="https://github.com/V2473/BeTransparent" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition">GitHub</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Команда</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#team" className="text-muted-foreground hover:text-accent transition">Be Transparent</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition">Контакти</Link></li>
              <li><Link href="https://github.com/V2473/BeTransparent" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition">GitHub Команди</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Слідкуйте</h4>
            <div className="flex gap-3">
              <Link href="https://github.com/V2473/BeTransparent" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass hover:bg-white/20 hover:border-white/30 flex items-center justify-center transition">
                <Github className="w-4 h-4 text-foreground" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg glass hover:bg-white/20 hover:border-white/30 flex items-center justify-center transition">
                <Linkedin className="w-4 h-4 text-foreground" />
              </Link>
              <Link href="mailto:team@yandia.gov.ua" className="w-8 h-8 rounded-lg glass hover:bg-white/20 hover:border-white/30 flex items-center justify-center transition">
                <Mail className="w-4 h-4 text-foreground" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 Yana.Diia. Створено командою Be Transparent для Diia.AI Hackathon</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-accent transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
