import { motion } from 'framer-motion'
import { AgentPersona } from '@/config/ai-agents'

interface ChatBubbleProps {
  agent: AgentPersona
  message: string
  timestamp: string
}

export function ChatBubble({ agent, message, timestamp }: ChatBubbleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 max-w-[80%] ${agent.id === 'zelenskyy' ? 'ml-auto flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-auto">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm shadow-sm">
          {agent.avatar}
        </div>
      </div>

      {/* Bubble */}
      <div className={`
        p-3 rounded-2xl shadow-sm border text-sm relative group
        ${agent.color}
        ${agent.id === 'zelenskyy' ? 'rounded-br-none' : 'rounded-bl-none'}
      `}>
        {/* Name */}
        <div className="text-[10px] font-bold opacity-70 mb-1 uppercase tracking-wider">
          {agent.name}
        </div>
        
        {/* Message */}
        <p className="leading-relaxed whitespace-pre-wrap">
          {message}
        </p>

        {/* Timestamp */}
        <span className="text-[10px] opacity-0 group-hover:opacity-50 absolute -bottom-5 right-0 transition-opacity text-gray-500">
          {timestamp}
        </span>
      </div>
    </motion.div>
  )
}
