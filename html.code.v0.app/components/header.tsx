'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/20 backdrop-blur-xl border-b border-border/30" />
      
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">Я</span>
          </div>
          <span className="font-bold text-foreground text-lg">Yana.Diia</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#mission" className="text-sm text-muted-foreground hover:text-foreground transition duration-300">
            Про проект
          </Link>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition duration-300">
            Можливості
          </Link>
          <Link href="#live-demo" className="text-sm text-muted-foreground hover:text-foreground transition duration-300">
            Live Demo
          </Link>
          <Link href="#case-studies" className="text-sm text-muted-foreground hover:text-foreground transition duration-300">
            Кейси
          </Link>
          <Link href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition duration-300">
            Архітектура
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="https://github.com/V2473/BeTransparent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <Github className="w-5 h-5 text-foreground" />
          </Link>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-lg">
            Розпочати
          </Button>
        </div>
      </div>
    </header>
  )
}
