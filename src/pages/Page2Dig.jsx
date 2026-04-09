import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceDot } from 'recharts'
import { researchLogs as mockLogs, signals as mockSignals, priceData as mockPriceData, signalTriggerMap } from '../data/mockData'
import cachedRuns from '../data/cachedRuns.json'

import AgentIcon from '../components/AgentIcon'

const SIGNAL_COLORS = {
  onchain: 'var(--signal-onchain)',
  social: 'var(--signal-social)',
  governance: 'var(--signal-governance)',
  market: 'var(--signal-market)',
  dev: 'var(--signal-dev)',
}

const AGENT_TYPE_COLORS = {
  onchain: 'var(--signal-onchain)',
  social: 'var(--signal-social)',
  market: 'var(--signal-market)',
  governance: 'var(--signal-governance)',
  price: 'var(--text-primary)',
  extract: 'var(--accent-primary)',
  validate: 'var(--semantic-positive)',
  scan: 'var(--accent-primary)',
  system: 'var(--text-primary)',
}

function getLogColor(log) {
  return log.agentColor || AGENT_TYPE_COLORS[log.agentType] || 'var(--text-primary)'
}

function ResearchLog({ logs, currentIndex }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [currentIndex])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4" style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
        RESEARCH LOG
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
        <AnimatePresence>
          {logs.slice(0, currentIndex + 1).map((log, i) => {
            const color = getLogColor(log)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 py-1.5 px-2 rounded"
                style={{
                  borderLeft: log.isHighlight ? `3px solid ${color}` : '3px solid transparent',
                  background: log.isHighlight ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', flexShrink: 0 }}>{log.time}</span>
                <AgentIcon name={log.icon} color={color} />
                <span style={{ color, flexShrink: 0, fontWeight: 600, fontSize: '12px' }}>{log.agent}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{log.message}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-2)', border: '1px solid var(--border-default)', maxWidth: 200 }}>
      <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{d.date}</div>
      <div style={{ color: 'var(--semantic-positive)', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${d.price}</div>
    </div>
  )
}

function ProgressBar({ current, total, currentAgent, done }) {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <div className="h-12 flex items-center justify-between px-6" style={{
      background: 'var(--bg-2)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
        {done ? `Research complete. ${total} signals found across 5 sources.` : `${currentAgent}... ${current}/${total} agents complete`}
      </div>
      <div className="w-[200px] h-2 rounded-full overflow-hidden relative" style={{ background: 'var(--border-default)' }}>
        <div className="h-full rounded-full transition-all duration-500 relative overflow-hidden" style={{ width: `${pct}%`, background: 'var(--signal-onchain)' }}>
          {!done && (
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'flow-light 1.5s infinite',
            }} />
          )}
        </div>
      </div>
    </div>
  )
}

// Dig-phase agent types (not validate/scan/system)
const DIG_AGENTS = new Set(['onchain', 'social', 'market', 'price', 'news', 'governance'])

export default function Page2Dig({ onNext, research }) {
  const isLive = research?.status === 'running' || research?.status === 'completed'
  const liveLogs = research?.logs ?? []
  const liveDigData = research?.digData
  const liveEvent = research?.eventData

  const [logIndex, setLogIndex] = useState(-1)
  const [visibleSignals, setVisibleSignals] = useState([])
  const [done, setDone] = useState(false)

  // All signals from dig data
  const liveSignals = liveDigData?.signals?.map(s => {
    // Convert timestamp to "Mon DD" format to match price chart
    let date = ''
    if (s.timestamp) {
      const ts = s.timestamp
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      let d = null
      if (/^\d{4}-\d{2}-\d{2}/.test(ts)) {
        d = new Date(ts + 'T00:00:00Z')
      } else if (/^\d{9,}$/.test(ts)) {
        d = new Date(parseInt(ts) * 1000)
      }
      if (d && !isNaN(d)) {
        date = `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`
      }
    }
    return { date, type: s.category, description: s.description, relevance: s.relevance_score ?? 0.8 }
  }) ?? []

  // Filter dig-phase logs only (exclude validate/scan/system)
  const digPhaseLogs = isLive
    ? liveLogs.filter(l => DIG_AGENTS.has(l.agentType) || l.agent === 'System' || l.agent === 'Event Confirmer')
    : mockLogs

  // Build a map: which dig-phase highlight log index triggers which signal
  // Spread signals evenly across highlighted logs
  const highlightIndices = digPhaseLogs
    .map((l, i) => l.isHighlight ? i : -1)
    .filter(i => i >= 0)

  // Live mode: replay dig-phase logs with natural timing
  useEffect(() => {
    if (!isLive) return
    if (digPhaseLogs.length === 0) return
    let idx = 0
    let sigIdx = 0
    let cancelled = false
    const sigsPerHighlight = Math.max(1, Math.ceil(liveSignals.length / Math.max(highlightIndices.length, 1)))

    function tick() {
      if (cancelled) return
      if (idx < digPhaseLogs.length) {
        setLogIndex(idx)
        if (highlightIndices.includes(idx) && sigIdx < liveSignals.length) {
          const nextBatch = liveSignals.slice(sigIdx, sigIdx + sigsPerHighlight)
          setVisibleSignals(prev => [...prev, ...nextBatch])
          sigIdx += sigsPerHighlight
        }
        idx++
        // Variable delay: highlights pause longer, normal logs are faster
        const isHL = highlightIndices.includes(idx - 1)
        const delay = isHL ? 600 + Math.random() * 400 : 150 + Math.random() * 250
        setTimeout(tick, delay)
      } else {
        setVisibleSignals(liveSignals)
        setDone(true)
      }
    }
    tick()
    return () => { cancelled = true }
  }, [isLive, digPhaseLogs.length, liveSignals.length])

  // Mock playback
  useEffect(() => {
    if (isLive) return
    if (logIndex >= mockLogs.length - 1) return
    const delay = 800 + Math.random() * 700
    const timer = setTimeout(() => {
      const next = logIndex + 1
      setLogIndex(next)
      const trigger = signalTriggerMap.find(t => t.logIndex === next)
      if (trigger) setVisibleSignals(prev => [...prev, mockSignals[trigger.signalIndex]])
      if (next >= mockLogs.length - 1) setDone(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [logIndex, isLive])

  const handleSkip = () => {
    setLogIndex((isLive ? digPhaseLogs : mockLogs).length - 1)
    setVisibleSignals(isLive ? liveSignals : signalTriggerMap.map(t => mockSignals[t.signalIndex]))
    setDone(true)
  }

  useEffect(() => {
    const handler = () => handleSkip()
    window.addEventListener('skip-animation', handler)
    return () => window.removeEventListener('skip-animation', handler)
  }, [isLive, liveSignals.length])

  useEffect(() => { if (!isLive) setLogIndex(0) }, [isLive])

  const displayLogs = isLive ? digPhaseLogs : mockLogs
  const displayLogIndex = logIndex
  const displaySignals = visibleSignals
  const displayDone = done

  const agentsDone = new Set(displayLogs.slice(0, displayLogIndex + 1).filter(l => l?.message?.includes('complete') || l?.message?.includes('Research complete')).map(l => l.agent)).size

  // Use cached price data for the token, or fall back to mock
  const tokenName = liveEvent?.token || ''
  const livePriceData = cachedRuns[tokenName]?.priceData
  const priceData = (isLive && livePriceData?.length) ? livePriceData : mockPriceData

  const startPrice = priceData[0]?.price ?? 0
  const endPrice = priceData[priceData.length - 1]?.price ?? 0
  const pctChange = isLive && liveEvent
    ? (liveEvent.change_pct ?? 0).toFixed(0)
    : startPrice > 0 ? (((endPrice - startPrice) / startPrice) * 100).toFixed(0) : 0

  return (
    <div className="h-full flex flex-col pt-12">
      <div className="flex-1 flex min-h-0">
        {/* Left panel: Active Extraction */}
        <div className="w-[45%] flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--border-default)' }}>
          {/* Left header */}
          <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
              Active Extraction
            </div>
            <div className="flex gap-4 mt-2" style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
              <span>TARGET: {tokenName || 'PENDLE'}/USDT</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>TIMEFRAME: 7d</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>AGENTS: {Math.min(agentsDone, 5)}/5</span>
            </div>
          </div>
          {/* Terminal log */}
          <div className="flex-1 min-h-0 px-6 py-4">
            <div className="h-full rounded-[14px] p-4" style={{
              background: 'var(--bg-2)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              <ResearchLog logs={displayLogs} currentIndex={displayLogIndex} />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[55%] flex flex-col overflow-hidden">
          {/* Asset price highlight */}
          <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-baseline gap-3">
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
              }}>
                ${startPrice.toFixed(2)} → ${endPrice.toFixed(2)}
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: 'var(--semantic-positive)',
              }}>
                +{pctChange}%
              </span>
            </div>
          </div>

          {/* Chart area */}
          <div className="px-6 pt-4" style={{ height: '48%', minHeight: 0 }}>
            <div className="h-full rounded-[14px] p-4" style={{
              background: 'var(--bg-2)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#priceGrad)" />
                  {displaySignals.map((sig, i) => {
                    const point = priceData.find(p => p.date === sig.date)
                    if (!point) return null
                    const c = SIGNAL_COLORS[sig.type]
                    return (
                      <ReferenceDot
                        key={i}
                        x={sig.date}
                        y={point.price}
                        r={5}
                        fill={c}
                        stroke={c}
                        strokeWidth={2}
                        fillOpacity={0.8}
                      />
                    )
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Signals section */}
          <div className="flex-1 min-h-0 px-6 pt-4 pb-4 flex flex-col">
            <div className="mb-3" style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
              CRITICAL SIGNALS
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              <AnimatePresence>
                {displaySignals.map((sig, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{
                      background: 'var(--bg-2)',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderLeft: `3px solid ${SIGNAL_COLORS[sig.type] || 'var(--text-tertiary)'}`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SIGNAL_COLORS[sig.type] || 'var(--text-tertiary)' }} />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{sig.date}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{sig.description}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: SIGNAL_COLORS[sig.type] || 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {(sig.relevance * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Next button — replaces progress bar when done */}
      <AnimatePresence>
        {displayDone ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-12 flex items-center justify-end px-6"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={onNext}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-all duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--signal-onchain)',
                boxShadow: '0 0 16px rgba(74, 144, 217, 0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(74, 144, 217, 0.5)'; e.currentTarget.style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(74, 144, 217, 0.3)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Extract Pattern →
            </button>
          </motion.div>
        ) : (
          <div className="h-12 flex items-center justify-between px-6" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              {displayLogIndex >= 0 ? displayLogs[displayLogIndex]?.agent : 'Starting'}... {Math.min(agentsDone, 5)}/5 agents
            </div>
            <div className="w-[160px] h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((agentsDone / 5) * 100, 100)}%`, background: 'var(--signal-onchain)' }} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
