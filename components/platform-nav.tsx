'use client'

import Link from 'next/link'

export function PlatformNav() {
  const routes = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/lego', label: 'Lego', icon: '🧱' },
    { href: '/debate', label: 'Debate', icon: '💬' },
    { href: '/pipeline', label: 'Pipeline', icon: '🔄' },
    { href: '/evaluation', label: 'Evaluation', icon: '⚖️' },
    { href: '/quantum', label: 'Quantum', icon: '🌌' },
    { href: '/blockchain', label: 'Blockchain', icon: '🔐' }
  ]

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
            <span className="text-2xl">🇺🇦</span>
            <span>Yana.Diia.AI</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
              >
                <span>{route.icon}</span>
                <span className="hidden md:inline">{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
