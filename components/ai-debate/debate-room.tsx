'use client'

import { useState, useEffect, useRef } from 'react'
import { AI_AGENTS, AgentPersona } from '@/config/ai-agents'
import { AgentAvatar } from './agent-avatar'
import { ChatBubble } from './chat-bubble'
import { mockLLM } from '@/lib/llm/providers/mock'

interface Message {
  id: string
  agentId: string
  text: string
  timestamp: string
}

export function DebateRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [isDebating, setIsDebating] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const startDebate = async () => {
    if (isDebating) return
    setIsDebating(true)
    setMessages([])

    // Mock debate sequence
    const sequence = [
      { agentId: 'zelenskyy', text: 'Всім привіт! Дивіться, нам треба запустити Finance.AI. Це має бути швидко і зручно. Що скажете про цей прототип?', delay: 1000 },
      { agentId: 'lesya', text: 'Я бачу тут гарні кольори, але чи зрозуміє це моя бабуся? Шрифт трохи замалий, і немає пояснень для людей, які не знають термінів.', delay: 2000 },
      { agentId: 'yaroslav', text: 'Лесю, краса - це добре, але де тут Дія.Підпис? Я не бачу перевірки реєстрів на першому кроці. Це ризик шахрайства!', delay: 2500 },
      { agentId: 'klitschko', text: 'А я дивлюся... і не бачу... де кнопка "Далі"? Вона має бути велика! Як мій кулак! І сервер... він витримає навантаження?', delay: 2000 },
      { agentId: 'boris', text: 'Dobryi den everybody! I think it looks fantastic! But maybe add more blue and yellow? Make it shine!', delay: 2000 },
      { agentId: 'nbu', text: 'Колеги, давайте серйозніше. API банку підключено коректно? Я бачу запит на IBAN, це добре. Але комісія не вказана.', delay: 2500 },
      { agentId: 'usyk', text: 'I am feel! I am very feel! Цей флоу сильний. Але треба тренуватися. Давайте ще один раунд тестів!', delay: 2000 },
      { agentId: 'zelenskyy', text: 'Добре, почув вас. Лесю - збільшити шрифт. Ярослав - додати підпис на старті. Кличко - кнопку зробимо. Працюємо!', delay: 2000 }
    ]

    for (const step of sequence) {
      setActiveAgentId(step.agentId)
      await new Promise(r => setTimeout(r, step.delay))
      
      const agent = AI_AGENTS.find(a => a.id === step.agentId)
      if (agent) {
        addMessage(agent, step.text)
      }
    }

    setActiveAgentId(null)
    setIsDebating(false)
  }

  const addMessage = (agent: AgentPersona, text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      agentId: agent.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            🏛️ AI Debate Chamber
            {isDebating && <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>}
          </h2>
          <p className="text-xs text-gray-500">7 агентів обговорюють ваш проєкт</p>
        </div>
        <button
          onClick={startDebate}
          disabled={isDebating}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isDebating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
          }`}
        >
          {isDebating ? 'Дебати тривають...' : 'Почати Дебати'}
        </button>
      </div>

      {/* Agents Row */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex justify-center gap-4 min-w-max px-4">
          {AI_AGENTS.map(agent => (
            <AgentAvatar 
              key={agent.id} 
              agent={agent} 
              isActive={activeAgentId === agent.id}
              isTyping={activeAgentId === agent.id}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
            <span className="text-6xl mb-4">💬</span>
            <p>Натисніть "Почати Дебати", щоб почути думку експертів</p>
          </div>
        ) : (
          messages.map(msg => {
            const agent = AI_AGENTS.find(a => a.id === msg.agentId)
            if (!agent) return null
            return (
              <ChatBubble 
                key={msg.id}
                agent={agent}
                message={msg.text}
                timestamp={msg.timestamp}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
