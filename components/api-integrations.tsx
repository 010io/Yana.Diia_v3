'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, GitBranch, Database, Zap, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

const integrations = [
  {
    name: 'Diia API',
    description: 'Ядро платформи для шеринга документів, електронного підпису та Bank ID інтеграції',
    endpoints: [
      'POST /api/v1/repository/create/',
      'GET /api/v1/repository/detail/{service_id}/',
      'GET /api/v1/repository/list/'
    ],
    features: ['Document Sharing', 'E-Signature', 'Bank ID', 'QR Validation'],
    repository: 'https://github.com/diia-open-source/be-gateway-service',
    status: 'stable',
    category: 'Core API'
  },
  {
    name: 'Public Service Catalog',
    description: 'Каталог всіх держпослуг з метаданими, категоріями та API',
    endpoints: [
      'GET /api/v1/services/',
      'GET /api/v1/services/{id}/',
      'GET /api/v1/categories/'
    ],
    features: ['Service Discovery', 'Metadata', 'Filtering', 'Search'],
    repository: 'https://github.com/diia-open-source/be-public-service-catalog',
    status: 'stable',
    category: 'Core API'
  },
  {
    name: 'data.gov.ua API',
    description: 'CKAN-based портал відкритих даних України з 80,000+ датасетами',
    endpoints: [
      'GET /api/3/action/package_list',
      'GET /api/3/action/package_search?q={query}',
      'GET /api/3/action/package_show?id={id}'
    ],
    features: ['Open Data', 'Statistics', 'Analytics', 'Search'],
    repository: 'https://data.gov.ua/pages/api-dokumentatsiia',
    status: 'stable',
    category: 'Data'
  },
  {
    name: 'iOS Components',
    description: 'UI компоненти для iOS додатку Дія з використанням Swift',
    endpoints: [
      'DSButtonPrimary',
      'DSTextFieldInput',
      'DSCardContainer'
    ],
    features: ['WCAG Compliant', 'Accessibility', 'Design System', 'SwiftUI'],
    repository: 'https://github.com/diia-open-source/ios-uicomponents',
    status: 'active',
    category: 'Components'
  },
  {
    name: 'Android Components',
    description: 'UI компоненти для Android додатку Дія з використанням Kotlin',
    endpoints: [
      'DSButton',
      'DSTextField',
      'DSCard'
    ],
    features: ['Material Design', 'Jetpack Compose', 'Accessibility', 'Design System'],
    repository: 'https://github.com/diia-open-source/android-uicomponents',
    status: 'active',
    category: 'Components'
  },
  {
    name: 'Electronic ID (ICEI)',
    description: 'Bank ID, Кваліфікований електронний підпис (КЕП), MobileID',
    endpoints: [
      'GET /auth/bankid/deeplink',
      'POST /auth/validate',
      'GET /identity/verify'
    ],
    features: ['Bank ID', 'Digital Signature', 'Mobile ID', 'Verification'],
    repository: 'https://id.gov.ua/',
    status: 'stable',
    category: 'Auth'
  }
]

const mcpServers = [
  {
    name: 'GitHub MCP',
    description: 'Доступ до diia-open-source репозиторіїв, PR, issues, commits',
    capabilities: ['Repo Management', 'File Operations', 'PR/Issue Management', 'Code Search'],
    usage: 'Auto-sync компонентів, моніторинг оновлень дизайн-системи',
    priority: 'High'
  },
  {
    name: 'Filesystem MCP',
    description: 'Безпечне читання локальних копій Diia компонентів',
    capabilities: ['File Read/Write', 'Directory Traversal', 'Parsing', 'Analysis'],
    usage: 'Парсинг Swift/Kotlin компонентів для RAG бази',
    priority: 'High'
  },
  {
    name: 'Memory MCP',
    description: 'Knowledge graph для зберігання історії flow та feedback',
    capabilities: ['Graph Storage', 'Query', 'Pattern Recognition', 'Analytics'],
    usage: 'Історія генерацій, AI-дошка натхнення',
    priority: 'Medium'
  },
  {
    name: 'PostgreSQL MCP',
    description: 'Production database для BRD, flow, evaluation результатів',
    capabilities: ['CRUD Operations', 'Transactions', 'Queries', 'Analytics'],
    usage: 'Storage для всіх даних та метрик',
    priority: 'High'
  },
  {
    name: 'Slack MCP',
    description: 'Team notifications та feedback колектор',
    capabilities: ['Messages', 'Channels', 'Threads', 'File Sharing'],
    usage: 'Сповіщення про згенеровані flow, team collaboration',
    priority: 'Medium'
  },
  {
    name: 'Brave Search MCP',
    description: 'Web search для актуальної інформації про Diia та служпослуги',
    capabilities: ['Search', 'Ranking', 'Content Extraction', 'News'],
    usage: 'Пошук актуальних даних про держпослуги',
    priority: 'Low'
  }
]

export default function APIIntegrations() {
  return (
    <section id="api-integrations" className="py-20 px-4 md:px-6 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 inline-flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Реальні API та MCP Інтеграції
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Підключені до Diia.AI Екосистеми
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Yana.Diia інтегрована з реальними API, GitHub MCP серверами та Diia Open Source компонентами для генерації flow
          </p>
        </div>

        <div className="space-y-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-accent" />
              Diia Open Source API
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((api) => (
                <Card key={api.name} className="glass border-white/10 p-6 rounded-xl hover:border-white/20 transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{api.name}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-medium mt-2 inline-block">
                        {api.category}
                      </span>
                    </div>
                    <Link 
                      href={api.repository} 
                      target="_blank"
                      className="p-2 rounded-lg glass hover:bg-white/10 transition"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition" />
                    </Link>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{api.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="text-xs font-semibold text-primary uppercase">Endpoints:</div>
                    <div className="space-y-1">
                      {api.endpoints.slice(0, 2).map((endpoint, idx) => (
                        <div key={idx} className="text-xs text-foreground/70 font-mono">
                          {endpoint}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {api.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-accent" />
              MCP (Model Context Protocol) Сервери
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mcpServers.map((mcp) => (
                <Card key={mcp.name} className="glass border-white/10 p-6 rounded-xl hover:border-white/20 transition">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-foreground text-lg">{mcp.name}</h4>
                    <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                      mcp.priority === 'High' ? 'bg-accent/20 text-accent' :
                      mcp.priority === 'Medium' ? 'bg-primary/20 text-primary' :
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {mcp.priority}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{mcp.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="text-xs font-semibold text-primary uppercase">Можливості:</div>
                    <div className="flex flex-wrap gap-1">
                      {mcp.capabilities.map((cap, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-accent/10 text-accent font-medium">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/20">
                    <div className="text-xs text-muted-foreground">
                      <strong>Використання:</strong> {mcp.usage}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="glass border-white/10 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-foreground text-lg mb-2">Безпека та Compliance</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ GDPR/Privacy - тільки публічні open-source дані</li>
                <li>✓ EUPL 1.2 License - повна дотримання ліцензії Diia</li>
                <li>✓ API Key Management - безпечне зберігання credentials</li>
                <li>✓ Open Source - transparency by design, верифіковане API</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
