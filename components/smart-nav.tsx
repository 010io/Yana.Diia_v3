'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Home, Layers, Zap, MessageSquare, Scale, Atom, 
  Shield, Menu, X, ChevronRight, ArrowLeft
} from 'lucide-react'

// Структура навігації з взаємозв'язками
const navStructure = {
  main: [
    { 
      id: 'home', 
      href: '/', 
      label: 'Головна', 
      icon: Home,
      description: 'Огляд платформи',
      related: ['lego', 'dashboard']
    },
    { 
      id: 'dashboard', 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Панель керування',
      related: ['lego', 'pipeline', 'evaluation']
    },
    { 
      id: 'lego', 
      href: '/lego', 
      label: 'LEGO Конструктор', 
      icon: Layers,
      description: 'Візуальний конструктор послуг',
      related: ['pipeline', 'debate', 'dashboard']
    },
    { 
      id: 'pipeline', 
      href: '/pipeline', 
      label: 'AI Pipeline', 
      icon: Zap,
      description: 'LLM обробка та генерація',
      related: ['lego', 'evaluation', 'debate']
    },
    { 
      id: 'debate', 
      href: '/debate', 
      label: 'AI Дебати', 
      icon: MessageSquare,
      description: 'Мульти-агентна дискусія',
      related: ['pipeline', 'evaluation', 'lego']
    },
    { 
      id: 'evaluation', 
      href: '/evaluation', 
      label: 'Оцінка', 
      icon: Scale,
      description: 'Аналіз якості послуг',
      related: ['debate', 'pipeline', 'dashboard']
    },
    { 
      id: 'quantum', 
      href: '/quantum', 
      label: 'Quantum', 
      icon: Atom,
      description: 'Квантові обчислення',
      related: ['blockchain', 'pipeline']
    },
    { 
      id: 'audit-trail', 
      href: '/audit-trail', 
      label: 'Audit Trail', 
      icon: Shield,
      description: 'Глаголична криптографія',
      related: ['quantum', 'evaluation']
    },
  ]
}

export function SmartNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentPage = navStructure.main.find(p => p.href === pathname)
  const relatedPages = currentPage?.related?.map(id => 
    navStructure.main.find(p => p.id === id)
  ).filter(Boolean) || []

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 font-bold text-lg">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                Я
              </span>
              <span>Yana.Diia</span>
            </Link>

            <div className="flex items-center gap-1">
              {navStructure.main.slice(1).map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between safe-area-top">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
              Я
            </span>
            <span className="text-sm">{currentPage?.label || 'Yana.Diia'}</span>
          </Link>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-16 safe-area-top">
            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
              {navStructure.main.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-500' : 'bg-white/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-white/50">{item.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
          <div className="flex justify-around items-center py-2">
            {navStructure.main.slice(0, 5).map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                    isActive ? 'text-blue-400' : 'text-white/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.label.split(' ')[0]}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Related Pages Widget (показується на внутрішніх сторінках) */}
      {pathname !== '/' && relatedPages.length > 0 && (
        <div className="hidden md:block fixed right-4 top-24 w-48 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 z-40">
          <div className="text-xs text-white/50 mb-2">Пов'язані розділи</div>
          {relatedPages.map(page => {
            if (!page) return null
            const Icon = page.icon
            return (
              <Link
                key={page.id}
                href={page.href}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition text-sm"
              >
                <Icon className="w-4 h-4 text-white/50" />
                <span>{page.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}