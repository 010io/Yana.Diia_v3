'use client'

import { DebateRoom } from '@/components/ai-debate/debate-room'

export default function DebatePage() {
  return (
    <div className="h-screen p-6 bg-gray-100 dark:bg-black flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Debate Chamber</h1>
        <p className="text-gray-500">
          Тут народжується істина. Наші AI-агенти аналізують вашу послугу з усіх боків.
        </p>
      </div>
      
      <div className="flex-1 max-w-5xl mx-auto w-full">
        <DebateRoom />
      </div>
    </div>
  )
}
