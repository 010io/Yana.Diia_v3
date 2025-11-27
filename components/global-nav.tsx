'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Home, Layers, Zap, MessageSquare, Scale, Atom, 
  Shield, Menu, X, Github, LayoutDashboard
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

// Єдина структура навігації для всього сайту
const NAV_ITEMS = [
  { id: 'home', href: '/', label: 'Головна', icon: Home, shortLabel: 'Home', showOnHome: false },
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Dash', showOnHome: false },
  { id: 'lego', href: '/lego', label: 'LEGO', icon: Layers, shortLabel: 'LEGO', showOnHome: false },
  { id: 'pipeline', href: '/pipeline', label: 'Pipeline', icon: Zap, shortLabel: 'AI', showOnHome: false },
  { id: 'evaluation', href: '/evaluation', label: 'Оцінка', icon: Scale, shortLabel: 'Eval', showOnHome: false },
  { id: 'debate', href: '/debate', label: 'Дебати', icon: MessageSquare, shortLabel: 'Chat', showOnHome: false },
  { id: 'quantum', href: '/quantum', label: 'Quantum', icon: Atom, shortLabel: 'Q', showOnHome: false },
  { id: 'audit-trail', href: '/audit-trail', label: 'Audit Trail', icon: Shield, shortLabel: 'AT', showOnHome: false },
]

// Посилання для головної сторінки (секції)
const HOME_LINKS = [
  { href: '#mission', label: 'Про проект' },
  { href: '#features', label: 'Можливості' },
  { href: '#live-demo', label: 'Live Demo' },
  { href: '#case-studies', label: 'Кейси' },
  { href: '#architecture', label: 'Архітектура' },
]

export function GlobalNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const isHomePage = pathname === '/'

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // MOBILE NAVIGATION
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' 
            : 'bg-gradient-to-b from-background/80 to-background/20 backdrop-blur-xl border-b border-border/30'
        }`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                <span className="text-white text-sm">Я</span>
              </div>
              <span className="font-bold text-sm">Yana.Diia</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/98 pt-16 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Platform Pages */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Платформа
                </h3>
                <div className="space-y-2">
                  {NAV_ITEMS.map(item => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-xl transition ${
                          active 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          active ? 'bg-blue-500' : 'bg-white/10'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Home Sections (if on home page) */}
              {isHomePage && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Розділи
                  </h3>
                  <div className="space-y-2">
                    {HOME_LINKS.map(link => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block p-4 rounded-xl hover:bg-white/5 transition"
                      >
                        <span className="font-medium">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="https://github.com/010-io/Yana.Diia_v3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </Link>
                
                {isHomePage && (
                  <Link href="/lego" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Розпочати з LEGO
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation (тільки НЕ на головній) */}
        {!isHomePage && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="flex justify-around items-center py-2 px-1">
              {NAV_ITEMS.slice(0, 5).map(item => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex flex-col items-center gap-0.5 p-2 rounded-lg min-w-[60px] transition ${
                      active ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                    <span className="text-[10px] font-medium">{item.shortLabel}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </>
    )
  }

  // DESKTOP NAVIGATION
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' 
        : 'bg-gradient-to-b from-background/80 to-background/20 backdrop-blur-xl border-b border-border/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">Я</span>
          </div>
          <span className="font-bold text-lg">Yana.Diia</span>
        </Link>

        {/* Navigation - показуємо різне для головної та інших сторінок */}
        <nav className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            // На головній - посилання на секції
            HOME_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition duration-300"
              >
                {link.label}
              </a>
            ))
          ) : (
            // На інших сторінках - навігація по платформі
            NAV_ITEMS.slice(0, 6).map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    active 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <Link
            href="https://github.com/010-io/Yana.Diia_v3"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 transition group"
          >
            <Github className="w-5 h-5 text-foreground" />
          </Link>

          {isHomePage && (
            <Link href="/lego">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-primary/20 rounded-lg">
                Розпочати
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
