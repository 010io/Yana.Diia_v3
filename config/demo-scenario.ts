/**
 * Finance.AI Demo Scenario
 * Step-by-step walkthrough for Demo Day
 */

export interface DemoStep {
  id: string
  title: string
  description: string
  action: 'navigate' | 'click' | 'type' | 'wait' | 'demo'
  target?: string
  duration: number // seconds
}

export const FINANCE_AI_DEMO: DemoStep[] = [
  {
    id: 'intro',
    title: '🎬 Вступ',
    description: 'Вітання та огляд платформи Yana.Diia.AI',
    action: 'demo',
    duration: 15
  },
  {
    id: 'lego-open',
    title: '🧱 Відкрити Lego Constructor',
    description: 'Перехід до інтерфейсу конструктора',
    action: 'navigate',
    target: '/lego',
    duration: 5
  },
  {
    id: 'lego-drag',
    title: '🎯 Збірка Finance.AI',
    description: 'Drag-and-drop 4 компонентів: DiiaSignature, AmountInput, BankSelect, SuccessBanner',
    action: 'demo',
    duration: 20
  },
  {
    id: 'yana-analysis',
    title: '🤖 Yana Analyzer',
    description: 'AI аналізує послугу в реальному часі (Score: 92/100)',
    action: 'wait',
    duration: 10
  },
  {
    id: 'debate-start',
    title: '💬 AI Debate Chamber',
    description: 'Запуск дебатів між 7 агентами',
    action: 'navigate',
    target: '/debate',
    duration: 5
  },
  {
    id: 'debate-watch',
    title: '🎭 Дебати',
    description: 'Леся, Ярослав, Зеленський та інші обговорюють послугу',
    action: 'wait',
    duration: 30
  },
  {
    id: 'quantum-optimize',
    title: '🌌 Quantum Optimization',
    description: 'Simulated Annealing знаходить 3 оптимальні варіанти',
    action: 'navigate',
    target: '/quantum',
    duration: 5
  },
  {
    id: 'quantum-run',
    title: '⚡ Запуск оптимізації',
    description: 'Візуалізація зниження енергії та конвергенції',
    action: 'click',
    target: 'button[optimize]',
    duration: 15
  },
  {
    id: 'variants-show',
    title: '✨ 3 варіанти',
    description: 'Minimal (3 кроки), Standard (5 кроків), Educational (7 кроків)',
    action: 'wait',
    duration: 10
  },
  {
    id: 'blockchain-record',
    title: '🔐 Blockchain Audit',
    description: 'Створення Glagolitic підпису та запис на Sepolia',
    action: 'navigate',
    target: '/blockchain',
    duration: 5
  },
  {
    id: 'glagolitic-sign',
    title: '📜 Glagolitic Signature',
    description: 'SHA-256 hash візуально представлений давнім писемством',
    action: 'demo',
    duration: 10
  },
  {
    id: 'export',
    title: '📦 Export',
    description: 'Генерація React components, Figma файлу',
    action: 'demo',
    duration: 5
  },
  {
    id: 'conclusion',
    title: '🎬 Завершення',
    description: 'Підсумок: Finance.AI створено за 2 хвилини',
    action: 'demo',
    duration: 10
  }
]

/**
 * Calculate total demo duration
 */
export function getTotalDuration(): number {
  return FINANCE_AI_DEMO.reduce((sum, step) => sum + step.duration, 0)
}

/**
 * Get demo sections for navigation
 */
export function getDemoSections() {
  return [
    { name: 'Lego Constructor', steps: FINANCE_AI_DEMO.slice(1, 4) },
    { name: 'AI Debate', steps: FINANCE_AI_DEMO.slice(4, 6) },
    { name: 'Quantum Optimization', steps: FINANCE_AI_DEMO.slice(6, 9) },
    { name: 'Blockchain & Export', steps: FINANCE_AI_DEMO.slice(9, 13) }
  ]
}
