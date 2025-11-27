'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  persona: string
  avatar: string
  message: string
  timestamp: Date
}

interface AIDebateChatProps {
  onComplete?: () => void
  buildDuration?: number // milliseconds
  messages?: Message[]
}

const PERSONAS = [
  { name: 'UX Designer', avatar: '🎨', color: 'bg-purple-100 text-purple-700' },
  { name: 'Security Expert', avatar: '🔐', color: 'bg-red-100 text-red-700' },
  { name: 'Finance Analyst', avatar: '💰', color: 'bg-green-100 text-green-700' },
  { name: 'Accessibility', avatar: '♿', color: 'bg-blue-100 text-blue-700' },
  { name: 'Performance', avatar: '⚡', color: 'bg-yellow-100 text-yellow-700' },
]

const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    persona: 'UX Designer',
    avatar: '🎨',
    message: 'Аналізую user flow... Рекомендую спростити крок підтвердження.',
  },
  {
    id: '2',
    persona: 'Security Expert',
    avatar: '🔐',
    message: 'Перевіряю безпеку даних. Додаю encryption для персональних даних.',
  },
  {
    id: '3',
    persona: 'Accessibility',
    avatar: '♿',
    message: 'Контраст кольорів відповідає WCAG 2.1 AA. Додаю aria-labels.',
  },
  {
    id: '4',
    persona: 'Performance',
    avatar: '⚡',
    message: 'Оптимізую завантаження. Lazy loading для зображень.',
  },
  {
    id: '5',
    persona: 'Finance Analyst',
    avatar: '💰',
    message: 'Розраховую вартість інфраструктури... ~$12/міс на Vercel.',
  },
]

export function AIDebateChat({ 
  onComplete, 
  buildDuration = 15000,
  messages = DEFAULT_MESSAGES 
}: AIDebateChatProps) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isCrashing, setIsCrashing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Typing sound effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/keyboard-typing.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages, currentMessage])

  // Typing animation
  useEffect(() => {
    if (currentIndex >= messages.length) {
      // All messages done - trigger crash effect
      const crashTimer = setTimeout(() => {
        setIsCrashing(true)
        audioRef.current?.pause()
        
        // Complete after crash animation
        setTimeout(() => {
          setIsComplete(true)
          onComplete?.()
        }, 1500)
      }, 1000)
      
      return () => clearTimeout(crashTimer)
    }

    const message = messages[currentIndex]
    let charIndex = 0
    setIsTyping(true)
    audioRef.current?.play()

    const typingInterval = setInterval(() => {
      if (charIndex < message.message.length) {
        setCurrentMessage(message.message.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        audioRef.current?.pause()
        
        // Add completed message
        setDisplayedMessages(prev => [...prev, message])
        setCurrentMessage('')
        
        // Move to next message after delay
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1)
        }, 800)
      }
    }, 30) // 30ms per character = ~33 chars/sec

    return () => {
      clearInterval(typingInterval)
      audioRef.current?.pause()
    }
  }, [currentIndex, messages, onComplete])

  // Progress calculation
  const progress = Math.min(100, (currentIndex / messages.length) * 100)

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Сервіс готовий!</h3>
        <p className="text-gray-600">Production build завершено успішно</p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">AI Team Debate</h3>
          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            className="bg-blue-600 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {displayedMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                PERSONAS.find(p => p.name === msg.persona)?.color || 'bg-gray-100'
              }`}>
                {msg.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{msg.persona}</span>
                  <span className="text-xs text-gray-400">
                    {msg.timestamp.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </div>
            </motion.div>
          ))}

          {/* Currently typing message */}
          {isTyping && currentMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                PERSONAS.find(p => p.name === messages[currentIndex]?.persona)?.color || 'bg-gray-100'
              }`}>
                {messages[currentIndex]?.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{messages[currentIndex]?.persona}</span>
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentMessage}
                  <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 animate-pulse" />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </div>

      {/* Crash Effect */}
      <AnimatePresence>
        {isCrashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-600 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center text-white"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <div className="text-6xl mb-4">⚠️</div>
                <div className="text-2xl font-bold mb-2">SYSTEM ERROR</div>
                <div className="text-sm opacity-80">Just kidding! Everything is ready 😄</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
