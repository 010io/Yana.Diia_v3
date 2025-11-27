'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, FileCheck, Lock, CheckCircle2 } from 'lucide-react'

interface AuditEntry {
  id: string
  timestamp: Date
  action: string
  user: string
  service: string
  status: 'success' | 'pending' | 'failed'
  hash: string
}

export default function AuditTrailPage() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading audit trail from blockchain
    setTimeout(() => {
      setAuditLog([
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          action: 'Service Generated',
          user: 'Ігор Омельченко',
          service: 'Finance.AI - Виплата допомоги ВПО',
          status: 'success',
          hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          action: 'Flow Validated',
          user: 'Yana.AI Judge',
          service: 'Adoption Service - Прихистити котика',
          status: 'success',
          hash: '0x3c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          action: 'Component Added',
          user: 'Богдан Параниця',
          service: 'LEGO Constructor - New Button',
          status: 'success',
          hash: '0x91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead73c2c2eb7b11a'
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <Shield className="w-4 h-4" />
      default: return <FileCheck className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Audit Trail</h1>
            <p className="text-gray-500">Автоматичне логування всіх операцій за кулісами</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Total Operations</span>
          </div>
          <div className="text-3xl font-bold">{auditLog.length}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Successful</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {auditLog.filter(e => e.status === 'success').length}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Blockchain Secured</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">100%</div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading audit trail...
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {auditLog.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg border ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{entry.action}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="font-medium">{entry.user}</span> • {entry.service}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp.toLocaleString('uk-UA')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span className="font-mono">{entry.hash.substring(0, 16)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Як працює Audit Trail
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc list-inside">
          <li>Всі операції автоматично логуються в реальному часі</li>
          <li>Кожна дія отримує унікальний blockchain hash для незмінності</li>
          <li>Повна прозорість для державних аудитів та compliance</li>
          <li>Захист від несанкціонованих змін та маніпуляцій</li>
        </ul>
      </div>
    </div>
  )
}
