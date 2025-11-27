'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Home, Layers, Zap, MessageSquare, Scale, Atom, 
  Shield, Menu, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react'

// Єдина структура навігації для всього сайту
const NAV_ITEMS = [
  { id: 'home', href: '/', label: 'Головна', icon: Home, shortLabel: 'Home' },
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: Home, shortLabel: 'Dash' },
  { id: 'lego', href: '/lego', label: 'LEGO', icon: Layers, shortLabel: 'LEGO' },
  { id: 'pipeline', href: '/pipeline', label: 'Pipeline', icon: Zap, shortLabel: 'AI' },
  { id: 'debate', href: '/debate', label: 'Дебати', icon: MessageSquare, shortLabel: 'Chat' },
  { id: 'evaluation', href: '/evaluation', label: 'Оцінка', icon: Scale, shortLabel: 'Eval' },
  { id: 'quantum', href: '/quantum', label: 'Quantum', icon: Atom, shortLabel: 'Q' },
  { id: 'audit-trail', href: '/audit-trail', label: 'Audit Trail', icon: Shield, shortLabel: 'AT' },
]

type NavPosition = 'top' | 'bottom' | 'left' | 'right'

export function UnifiedNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [position, setPosition] = useState<NavPosition>('top')
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem('nav-position') as NavPosition
    if (saved) setPosition(saved)
  }, [])

  // Save position
  const changePosition = (newPos: NavPosition) => {
    setPosition(newPos)
    localStorage.setItem('nav-position', newPos)
  }

  // Position toggle button
  const PositionToggle = () => (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
      <button 
        onClick={() => changePosition('top')}
        className={`p-1.5 rounded ${position === 'top' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        title="Зверху"
      >
        <ChevronUp className="w-3 h-3" />
      </button>
      <button 
        onClick={() => changePosition('bottom')}
        className={`p-1.5 rounded ${position === 'bottom' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        title="Знизу"
      >
        <ChevronDown className="w-3 h-3" />
      </button>
      <button 
        onClick={() => changePosition('left')}
        className={`p-1.5 rounded ${position === 'left' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        title="Зліва"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>
      <button 
        onClick={() => changePosition('right')}
        className={`p-1.5 rounded ${position === 'right' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        title="Справа"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )

  // MOBILE: Bottom navigation (золотий стандарт)
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between safe-area-top">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              Я
            </span>
            <span className="font-bold text-sm">Yana.Diia</span>
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Full Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/98 pt-16 safe-area-top overflow-y-auto">
            <div className="p-4 space-y-2">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
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
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation (ЗОЛОТИЙ СТАНДАРТ) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
          <div className="flex justify-around items-center py-2 px-1">
            {NAV_ITEMS.slice(0, 5).map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-lg min-w-[60px] transition ${
                    isActive ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] font-medium">{item.shortLabel}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  // DESKTOP: Configurable position
  const navClasses = {
    top: 'fixed top-0 left-0 right-0 h-14 flex-row border-b',
    bottom: 'fixed bottom-0 left-0 right-0 h-14 flex-row border-t',
    left: 'fixed top-0 left-0 bottom-0 w-16 flex-col border-r',
    right: 'fixed top-0 right-0 bottom-0 w-16 flex-col border-l',
  }

  const isVertical = position === 'left' || position === 'right'

  return (
    <nav className={`z-50 bg-black/95 backdrop-blur-xl border-white/10 ${navClasses[position]}`}>
      <div className={`flex items-center ${isVertical ? 'flex-col h-full py-4' : 'justify-between px-4 h-full'} max-w-7xl mx-auto w-full`}>
        
        {/* Logo */}
        <Link href="/" className={`flex items-center gap-2 ${isVertical ? 'mb-6' : ''}`}>
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
            Я
          </span>
          {!isVertical && <span className="font-bold hidden lg:block">Yana.Diia</span>}
        </Link>

        {/* Nav Items */}
        <div className={`flex ${isVertical ? 'flex-col flex-1 gap-2' : 'items-center gap-1'}`}>
          {NAV_ITEMS.slice(1).map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-2 rounded-lg transition ${
                  isVertical 
                    ? `p-3 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`
                    : `px-3 py-2 text-sm ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {!isVertical && <span className="hidden lg:inline">{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Position Toggle */}
        <div className={isVertical ? 'mt-auto' : ''}>
          <PositionToggle />
        </div>
      </div>
    </nav>
  )
}

// CSS helper for safe areas (add to globals.css)
export const safeAreaCSS = `
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-area-left { padding-left: env(safe-area-inset-left); }
.safe-area-right { padding-right: env(safe-area-inset-right); }
`