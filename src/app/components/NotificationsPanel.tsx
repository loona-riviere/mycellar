'use client'

import { useState, useMemo } from 'react'
import { Bell, Calendar, Clock, ChevronDown } from 'lucide-react'
import type { Bottle } from '@/app/lib/definitions'
import { motion, AnimatePresence } from 'framer-motion'

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

    const getPriorityColor = (priority: 'high' | 'medium') =>
        priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'

    const getTypeIcon = (type: 'maturity' | 'overdue') =>
        type === 'maturity' ? <Clock className="w-4 h-4 text-blue-500" /> : <Bell className="w-4 h-4 text-red-500" />

    return (
        <div className="mb-6 rounded-3xl shadow-lg border border-gray-100 bg-white/70 backdrop-blur-lg overflow-hidden">
            {/* Header */}
            <button
                className="w-full cursor-pointer bg-gradient-to-r from-rose-50 to-red-50 px-4 py-2 flex items-center justify-between hover:from-rose-100 hover:to-red-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bell className="w-4 h-4 text-red-700"/>
                        <motion.span
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow"
                        >
                            {notifications.length}
                        </motion.span>
                    </div>
                    <h2 className="font-medium text-red-800 text-base">
                        Notifications
                    </h2>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-red-700 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>


            {/* Liste animée */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        className="divide-y divide-gray-100 max-h-96 overflow-y-auto"
                    >
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                className="p-4 hover:bg-gray-50 transition-colors sm:p-5"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(notif.priority)}`}/>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                                {getTypeIcon(notif.type)}
                                                <span className="text-sm font-medium text-gray-800">
                          {notif.type === 'maturity' ? 'Bientôt à maturité' : 'À boire rapidement'}
                        </span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                                        notif.priority === 'high'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                >
                          {notif.priority === 'high' ? 'Urgent' : 'Info'}
                        </span>
                                            </div>
                                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" />
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
