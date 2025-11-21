import { AgentPersona } from '@/config/ai-agents'

interface AgentAvatarProps {
  agent: AgentPersona
  isActive?: boolean
  isTyping?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AgentAvatar({ agent, isActive = false, isTyping = false, size = 'md' }: AgentAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-3xl'
  }

  return (
    <div className="relative group">
      {/* Avatar Circle */}
      <div className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        bg-white dark:bg-gray-800 border-2 shadow-sm transition-all duration-300
        ${isActive ? 'border-blue-500 scale-110 shadow-blue-200 dark:shadow-blue-900' : 'border-gray-200 dark:border-gray-700 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}
      `}>
        {agent.avatar}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-[8px] text-white">...</span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
        {agent.name}
      </div>
    </div>
  )
}
