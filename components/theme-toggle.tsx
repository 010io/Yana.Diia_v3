'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initialTheme = savedTheme || 'dark'
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-white/20 animate-pulse" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-lg transition-all duration-300 hover:scale-105
                 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20
                 border border-white/20 hover:border-white/30
                 flex items-center justify-center"
      aria-label={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 group-hover:text-blue-500 transition-colors" />
      )}
      
      {/* Tooltip */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 
                       bg-black/90 dark:bg-white/90 text-white dark:text-black 
                       text-xs rounded opacity-0 group-hover:opacity-100 
                       transition-opacity whitespace-nowrap pointer-events-none">
        {theme === 'dark' ? 'Світла тема' : 'Темна тема'}
      </span>
    </button>
  )
}
