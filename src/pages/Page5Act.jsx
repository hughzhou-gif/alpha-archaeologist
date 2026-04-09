import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, ReferenceArea, Tooltip } from 'recharts'
import { actionCards as mockActionCards, proofPriceData } from '../data/mockData'
import { Target, CircleCheck, Clock, ChevronDown, AlertTriangle } from 'lucide-react'

function MatchProgressBar({ confirmed, total }) {
  return (
    <div className="flex gap-1 items-center">
      <div className="flex gap-1 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full"
            style={{
              background: i < confirmed ? 'var(--accent-primary)' : 'transparent',
              border: i >= confirmed ? '1px solid var(--border-medium)' : 'none',
              animation: i >= confirmed ? 'glow-pulse 2s infinite' : 'none',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700, marginLeft: 8 }}>
        {Math.round((confirmed / total) * 100)}%
      </span>
    </div>
  )
}

function ActionCard({ data, index, isExpanded, onToggle }) {
  const isMain = index === 0

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.2, type: 'spring', stiffness: 100 }}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
      className={`w-full rounded-[14px] transition-all duration-200 ${!isExpanded ? 'cursor-pointer' : ''}`}
      onClick={onToggle}
      style={{
        background: 'var(--bg-2)',
        border: isMain ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
        boxShadow: isMain ? '0 0 40px rgba(255, 40, 130, 0.06)' : 'none',
      }}
      onMouseEnter={e => { if (!isMain) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
      onMouseLeave={e => { if (!isMain) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
    >
      {/* Compact header — always visible */}
      <div className="p-5 flex items-center gap-4">
        {/* Left: token + match */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Target size={14} strokeWidth={1.5} style={{ color: 'var(--semantic-positive)', flexShrink: 0 }} />
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {data.token}
          </div>
        </div>

        {/* Center: progress bar */}
        <div className="flex-1">
          <MatchProgressBar confirmed={data.matchProgress.confirmed} total={data.matchProgress.total} />
        </div>

        {/* Right: match count + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="px-2 py-1 rounded-full" style={{
            fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: 'var(--accent-primary)', background: 'var(--accent-primary-muted)',
          }}>
            {data.matchProgress.confirmed}/{data.matchProgress.total}
          </div>
          <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div style={{ height: 1, background: 'var(--border-default)', marginBottom: 16 }} />

              {/* Signals */}
              <div className="space-y-3">
                {data.signals.map((sig, i) => (
                  <motion.div
                    key={sig.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      {sig.status === 'confirmed' ? <CircleCheck size={16} strokeWidth={1.5} style={{ color: 'var(--semantic-positive)' }} /> : <Clock size={16} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />}
                    </span>
                    <div className="flex-1">
                      <div style={{
                        fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-body)',
                        color: sig.status === 'confirmed' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      }}>
                        {sig.name}
                      </div>
                      <div style={{
                        fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 2,
                      }}>
                        {sig.status === 'confirmed' ? sig.detail : 'waiting...'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--border-default)', margin: '16px 0' }} />

              {/* Stats row */}
              <div className="flex gap-8">
                {[
                  { label: 'Win Rate', value: `${data.winRate}%` },
                  { label: 'Avg Move', value: data.avgMove },
                  { label: 'Avg Lead', value: data.avgLead },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}>{s.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Proof chart — only for main card */}
              {data.proofText && (
                <div className="mt-4 flex items-center gap-6 p-4 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex-1" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {data.proofText}
                  </div>
                  <div className="w-[240px] h-[100px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={proofPriceData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                        <defs>
                          <linearGradient id={`proofGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="price" stroke="var(--accent-primary)" strokeWidth={1.5} fill={`url(#proofGrad-${index})`} />
                        {data.alertDate && <ReferenceLine x={data.alertDate} stroke="var(--semantic-info)" strokeDasharray="4 4" />}
                        {data.moveDate && <ReferenceLine x={data.moveDate} stroke="var(--semantic-positive)" strokeDasharray="4 4" />}
                        {data.alertDate && data.moveDate && <ReferenceArea x1={data.alertDate} x2={data.moveDate} fill="var(--semantic-positive)" fillOpacity={0.06} />}
                        <XAxis dataKey="date" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)' }}
                          labelStyle={{ color: 'var(--text-secondary)' }}
                          itemStyle={{ color: 'var(--text-primary)' }}
                          formatter={v => [`$${v}`, 'Price']}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  Sources: {data.sourceCases.join(', ')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <AlertTriangle size={12} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Not financial advice. DYOR.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  if (isMain) {
    return (
      <div className="rounded-[16px] p-[2px]" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--semantic-positive))', boxShadow: '0 0 40px rgba(255, 40, 130, 0.06)' }}>
        {cardContent}
      </div>
    )
  }

  return cardContent
}

export default function Page5Act({ research }) {
  const liveAct = research?.actData

  // Convert live act cards to the component's expected shape
  const actionCards = liveAct?.cards?.length ? liveAct.cards.map(c => {
    // Parse match_ratio — could be "2/6" string or number
    const ratioStr = String(c.match_ratio || '0/4')
    const ratioParts = ratioStr.includes('/') ? ratioStr.split('/').map(Number) : [Math.round(c.match_ratio * 4), 4]
    const confirmed = ratioParts[0] || 0
    const total = ratioParts[1] || 4

    // waiting_for could be string or array
    const waitingFor = Array.isArray(c.waiting_for)
      ? c.waiting_for
      : typeof c.waiting_for === 'string'
        ? c.waiting_for.replace(/^Waiting for:\s*/i, '').split(',').map(s => s.trim()).filter(Boolean)
        : []

    // Derive confirmed signals: all pattern conditions minus waiting ones
    const allConditions = research?.extractData?.conditions || []
    const confirmedSignals = allConditions
      .filter(cond => !waitingFor.includes(cond.signal_type))
      .map(cond => ({
        name: cond.signal_type.replace(/_/g, ' '),
        status: 'confirmed',
        detail: cond.description || cond.signal_type,
      }))

    return {
      token: c.token,
      matchProgress: { confirmed, total },
      signals: [
        ...confirmedSignals,
        ...waitingFor.map(w => ({
          name: w.replace(/_/g, ' '), status: 'waiting', detail: 'waiting...',
        })),
      ],
      winRate: Math.round((c.historical_win_rate ?? 0.625) * 1000) / 10,
      avgMove: '+' + Math.round((c.historical_win_rate ?? 0.6) * 200) + '%',
      avgLead: '4.2 days',
      sourceCases: c.source_cases || [],
      alertDate: null,
      moveDate: null,
      proofText: null,
    }
  }) : mockActionCards

  const [expandedIndex, setExpandedIndex] = useState(null)
  const [visibleCards, setVisibleCards] = useState(0)

  useEffect(() => {
    if (visibleCards < actionCards.length) {
      const t = setTimeout(() => setVisibleCards(v => v + 1), 500)
      return () => clearTimeout(t)
    } else {
      // Auto-expand the first card after all appear
      const t = setTimeout(() => setExpandedIndex(0), 600)
      return () => clearTimeout(t)
    }
  }, [visibleCards])

  useEffect(() => { setVisibleCards(1) }, [])

  return (
    <div className="h-full flex flex-col pt-16 px-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[800px] mx-auto mb-6"
      >
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
          PATTERN MATCH FEED
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {actionCards.length} tokens matching
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {liveAct?.cards?.[0]?.pattern_name ? '' : 'Pattern #P-2025-031'}
          </span>
        </div>
        <div className="mt-1" style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
          &quot;{liveAct?.cards?.[0]?.pattern_name || 'Silent Accumulation + Catalyst'}&quot; — win rate: {actionCards[0]?.winRate?.toFixed(1) ?? '62.5'}%, avg lead: 4.2 days
        </div>
      </motion.div>

      {/* Cards feed */}
      <div className="w-full max-w-[800px] mx-auto flex-1 overflow-y-auto space-y-3 pb-8">
        {actionCards.slice(0, visibleCards).map((card, i) => (
          <ActionCard
            key={card.token}
            data={card}
            index={i}
            isExpanded={expandedIndex === i}
            onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}
