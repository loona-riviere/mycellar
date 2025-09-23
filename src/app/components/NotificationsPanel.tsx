'use client'

import { useState, useMemo } from 'react'
import { Bell, Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Bottle } from '@/app/lib/definitions'

interface Notification {
  id: string
  type: 'maturity' | 'overdue'
  bottle: Bottle
  message: string
  priority: 'high' | 'medium'
  score: number
  date: string
}

interface NotificationsProps {
  bottles: Bottle[]
}


export default function NotificationsPanel({ bottles }: NotificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const notifications = useMemo<Notification[]>(() => {
    const currentYear = new Date().getFullYear()

    const notifList = bottles
      .filter(b => !b.consumed && b.min_year && b.max_year)
      .map(bottle => {
        const maxYear = bottle.max_year!
        const yearsFromMax = maxYear - currentYear
        const yearsPassedMax = currentYear - maxYear

        let type: 'maturity' | 'overdue'
        let priority: 'high' | 'medium'
        let message = ''
        let score = 0

        if (yearsPassedMax >= 0) {
          type = 'overdue'
          priority = 'high'
          score = 100 + yearsPassedMax
          message =
            yearsPassedMax === 0
              ? `${bottle.estate}${bottle.cuvee ? ` — ${bottle.cuvee}` : ''} (${bottle.year}) - Dernière année optimale !`
              : `${bottle.estate}${bottle.cuvee ? ` — ${bottle.cuvee}` : ''} (${bottle.year}) dépasse sa période optimale (${yearsPassedMax} ans) - à boire rapidement !`
        } else if (yearsFromMax <= 3) {
          type = 'maturity'
          priority = 'medium'
          score = 50 + (3 - yearsFromMax)
          message = `${bottle.estate}${bottle.cuvee ? ` — ${bottle.cuvee}` : ''} (${bottle.year}) en déclin dans ${yearsFromMax} ans`
        } else {
          return null
        }

        return { id: `${type}_${bottle.id}`, type, bottle, message, priority, score, date: new Date().toISOString() }
      })
      .filter(Boolean) as Notification[]

    notifList.sort((a, b) => b.score - a.score)

    return notifList
  }, [bottles])

  if (notifications.length === 0) return null

  const handleMouseEnter = (bottleId: string) => {
    router.prefetch(`/bottles/${bottleId}`)
  }

  const getPriorityColor = (priority: 'high' | 'medium') =>
    priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'

  const getTypeIcon = (type: 'maturity' | 'overdue') =>
    type === 'maturity' ? <Clock className="w-4 h-4" /> : <Bell className="w-4 h-4" />

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 border-b cursor-pointer hover:from-orange-100 hover:to-red-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {notifications.length}
              </span>
            </div>
            <h2 className="font-semibold text-orange-800">
              Notifications de cave ({notifications.length})
            </h2>
          </div>
          <div className="text-orange-600">
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(notif.priority)}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-gray-600">{getTypeIcon(notif.type)}</div>
                      <span className="text-sm font-medium text-gray-800">
                        {notif.type === 'maturity' ? 'Bientôt à maturité' : 'À boire rapidement'}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${notif.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        {notif.priority === 'high' ? 'Urgent' : 'Info'}
                      </span>
                    </div>
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
                  {notif.bottle.appellation && (
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.bottle.appellation} • {notif.bottle.region}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
