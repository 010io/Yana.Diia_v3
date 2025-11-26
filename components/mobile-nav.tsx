'use client'

import { Home, ArrowLeft, Menu, Layers, Zap } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on desktop (hidden md:flex) or if specifically excluded
  if (pathname === '/') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 md:hidden z-50 safe-area-bottom">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => router.back()}
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>

        <Link href="/" className={`flex flex-col items-center gap-1 text-xs ${pathname === '/' ? 'text-blue-500' : 'text-muted-foreground'} transition`}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Link href="/lego" className={`flex flex-col items-center gap-1 text-xs ${pathname === '/lego' ? 'text-blue-500' : 'text-muted-foreground'} transition`}>
          <Layers className="w-6 h-6" />
          <span>Lego</span>
        </Link>

        <Link href="/pipeline" className={`flex flex-col items-center gap-1 text-xs ${pathname === '/pipeline' ? 'text-blue-500' : 'text-muted-foreground'} transition`}>
          <Zap className="w-6 h-6" />
          <span>Pipeline</span>
        </Link>
      </div>
    </div>
  )
}
