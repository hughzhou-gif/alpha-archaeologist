import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { validationLogs, validationMetrics } from '../data/mockData'
import AgentIcon from '../components/AgentIcon'
import { Check, X, Loader2, CheckCircle } from 'lucide-react'

function useCountUp(end, decimals = 0, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(eased * end)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration])
  return value.toFixed(decimals)
}

const HIGHLIGHT_COLORS = {
  green: 'var(--semantic-positive)',
  red: 'var(--semantic-negative)',
  gray: 'var(--text-tertiary)',
}

const DOT_COLORS = {
  hit: 'var(--semantic-positive)',
  falsePositive: 'var(--semantic-negative)',
  miss: 'var(--dot-miss)',
}

/* ---------- Hidden log (keeps scroll/ref for skip-animation) ---------- */
function ValidateLog({ logs, currentIndex }) {
  const containerRef = useRef(null)
  let lastPhase = null

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [currentIndex])

  const visibleLogs = logs.slice(0, currentIndex + 1)

  return (
    <div style={{ display: 'none' }}>
      <div ref={containerRef}>
        {visibleLogs.map((log, i) => {
          const showSeparator = log.phase !== lastPhase && lastPhase !== null && log.phase !== 'setup'
          lastPhase = log.phase
          return <div key={i}>{log.message}</div>
        })}
      </div>
    </div>
  )
}

/* ---------- Validation Checklist ---------- */
const CHECKLIST_ITEMS = [
  {
    phase: 'positive',
    title: 'Positive Scan',
    detail: '8,461 events analyzed, 5 hits found with 3+ signal alignment across on-chain, governance, social, and market data.',
  },
  {
    phase: 'negative',
    title: 'Negative Scan',
    detail: '3 false positives identified where pattern appeared but no >50% pump followed within 14 days.',
  },
  {
    phase: 'result',
    title: 'Synthesis Results',
    detail: 'All metrics pass threshold. Hit rate 62.5%, lift 3.27x vs baseline, false positive rate within tolerance.',
  },
]

function ValidationChecklist({ logs, currentIndex }) {
  // Compute which phases have fully completed based on log playback
  const completedPhases = useMemo(() => {
    const done = new Set()
    if (currentIndex < 0) return done

    const visible = logs.slice(0, currentIndex + 1)

    // A phase is complete when we've seen the LAST log entry for that phase
    // Find the last index of each phase in the full log array
    const lastIndexOf = {}
    logs.forEach((l, i) => { lastIndexOf[l.phase] = i })

    // Also track first index so we know when a phase has started
    const firstIndexOf = {}
    logs.forEach((l, i) => { if (!(l.phase in firstIndexOf)) firstIndexOf[l.phase] = i })

    for (const phase of ['positive', 'negative', 'result']) {
      if (currentIndex >= lastIndexOf[phase]) {
        done.add(phase)
      }
    }
    return done
  }, [logs, currentIndex])

  // Determine which items are visible (phase has started in the log)
  const visibleItems = useMemo(() => {
    if (currentIndex < 0) return []
    const firstIndexOf = {}
    logs.forEach((l, i) => { if (!(l.phase in firstIndexOf)) firstIndexOf[l.phase] = i })

    return CHECKLIST_ITEMS.filter(item => currentIndex >= (firstIndexOf[item.phase] ?? Infinity))
  }, [logs, currentIndex])

  return (
    <div className="h-full flex flex-col">
      {/* Title area */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          Backtest Validation
        </h2>
        <p style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-secondary)',
          margin: '8px 0 0 0',
          lineHeight: 1.5,
        }}>
          Deep history cross-referencing completed. Pattern synthetics demonstrate high-confidence institutional alignment.
        </p>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <AnimatePresence>
          {visibleItems.map((item) => {
            const done = completedPhases.has(item.phase)
            return (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: done ? 'rgba(0, 200, 83, 0.04)' : 'transparent',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.3s ease',
                }}
              >
                {/* Icon */}
                <div style={{ flexShrink: 0, marginTop: '1px' }}>
                  {done ? (
                    <CheckCircle size={18} strokeWidth={1.8} style={{ color: 'var(--semantic-positive)' }} />
                  ) : (
                    <Loader2
                      size={18}
                      strokeWidth={1.8}
                      style={{
                        color: 'var(--text-tertiary)',
                        animation: 'spin 1.5s linear infinite',
                      }}
                    />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    color: done ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.3s ease',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-tertiary)',
                    marginTop: '4px',
                    lineHeight: 1.5,
                  }}>
                    {item.detail}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Backtest Scatter — floating bubble layout ---------- */

// Pre-defined positions for organic scattered layout
const BUBBLE_POSITIONS = [
  { top: '5%', left: '10%' },
  { top: '8%', left: '55%' },
  { top: '25%', left: '30%' },
  { top: '20%', left: '70%' },
  { top: '42%', left: '8%' },
  { top: '45%', left: '50%' },
  { top: '38%', left: '80%' },
  { top: '60%', left: '25%' },
  { top: '62%', left: '60%' },
  { top: '75%', left: '10%' },
  { top: '72%', left: '45%' },
]

function BacktestScatter({ events }) {
  const hits = events.filter(e => e.type === 'hit').length
  const fps = events.filter(e => e.type === 'falsePositive').length
  const misses = events.filter(e => e.type === 'miss').length

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
          BACKTEST RESULTS
        </div>
        <div className="flex gap-4" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--semantic-positive)' }} /><span style={{ color: 'var(--semantic-positive)' }}>{hits} HIT</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--semantic-negative)' }} /><span style={{ color: 'var(--semantic-negative)' }}>{fps} FP</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--dot-miss)' }} /><span style={{ color: 'var(--text-tertiary)' }}>{misses} MISS</span></span>
        </div>
      </div>

      {/* Floating bubble area */}
      <div className="flex-1 relative overflow-hidden">
        {events.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-[14px] px-6 py-5 flex flex-col items-center gap-3" style={{ background: 'var(--bg-2)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <Loader2 size={20} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)', animation: 'spin 1.5s linear infinite' }} />
              <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Waiting for results...</span>
            </div>
          </div>
        )}
        <AnimatePresence>
          {events.map((evt, idx) => {
            const color = DOT_COLORS[evt.type]
            const label = evt.type === 'hit' ? 'HIT' : evt.type === 'falsePositive' ? 'FALSE POS' : 'MISS'
            const pos = BUBBLE_POSITIONS[idx % BUBBLE_POSITIONS.length]
            const isHit = evt.type === 'hit'
            return (
              <motion.div
                key={`${evt.token}-${evt.date}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: idx * 0.05 }}
                className="absolute rounded-[14px] transition-all duration-200"
                style={{
                  ...pos,
                  background: 'var(--bg-2)',
                  border: `1.5px solid ${color}30`,
                  padding: isHit ? '16px 20px' : '12px 16px',
                  minWidth: isHit ? 140 : 100,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 20px ${color}20` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--text-primary)', fontSize: isHit ? '16px' : '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{evt.token}</span>
                  <span style={{ color, fontSize: isHit ? '16px' : '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{evt.change}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  {evt.date}
                </div>
                {/* Small verdict badge */}
                <div className="rounded-full inline-block" style={{
                  fontSize: '9px', fontWeight: 700, fontFamily: 'var(--font-mono)', color,
                  background: `${color}15`,
                  padding: '4px 8px',
                  marginTop: 8,
                }}>
                  {label}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- MetricCard (unchanged) ---------- */
function MetricCard({ label, value, unit, threshold, passed, delay }) {
  const decimals = unit === '%' ? 1 : unit === 'x' ? 2 : 0
  const displayed = useCountUp(value, decimals)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex-1 rounded-[12px] p-5 relative"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: `0.5px solid ${passed ? 'var(--semantic-positive)' : 'var(--semantic-negative)'}`,
        boxShadow: passed ? '0 0 20px rgba(0, 200, 83, 0.1)' : '0 0 20px rgba(255, 68, 68, 0.1)',
      }}
    >
      <div className="absolute top-3 right-3">{passed ? <Check size={16} strokeWidth={2} style={{ color: 'var(--semantic-positive)' }} /> : <X size={16} strokeWidth={2} style={{ color: 'var(--semantic-negative)' }} />}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>{label}</div>
      <div className="mt-2" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {displayed}{unit}
      </div>
      <div className="mt-1" style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{threshold}</div>
    </motion.div>
  )
}

/* ---------- VerdictBanner (added Deploy Scanner button) ---------- */
function VerdictBanner({ passed, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 rounded-[12px] p-6 flex items-center justify-between"
      style={{
        background: passed ? 'rgba(0, 200, 83, 0.06)' : 'rgba(255, 68, 68, 0.06)',
        backdropFilter: 'blur(10px)',
        border: `0.5px solid ${passed ? 'var(--semantic-positive)' : 'var(--semantic-negative)'}`,
      }}
    >
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-body)', color: passed ? 'var(--semantic-positive)' : 'var(--semantic-negative)' }}>
          {passed ? <>PATTERN VALIDATED <Check size={20} strokeWidth={2} style={{ color: 'var(--semantic-positive)', display: 'inline', verticalAlign: 'middle' }} /></> : <>PATTERN REJECTED <X size={20} strokeWidth={2} style={{ color: 'var(--semantic-negative)', display: 'inline', verticalAlign: 'middle' }} /></>}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-2"
          style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          This pattern appeared 8 times in 12 months. 5 times it preceded a &gt;50% pump. It performs 3.27x better than chance.
        </motion.div>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-[12px] text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-80"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          Deploy Scanner
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-[12px] text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-80"
          style={{ fontFamily: 'var(--font-mono)', background: 'var(--accent-primary)', animation: 'glow-pulse 2s infinite' }}
        >
          Scan Market
        </button>
      </div>
    </motion.div>
  )
}

/* ---------- Page ---------- */
export default function Page4Validate({ onNext }) {
  const [logIndex, setLogIndex] = useState(-1)
  const [scatterEvents, setScatterEvents] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showVerdict, setShowVerdict] = useState(false)

  // Log playback
  useEffect(() => {
    if (logIndex >= validationLogs.length - 1) return
    const delay = 400 + Math.random() * 400
    const timer = setTimeout(() => {
      const next = logIndex + 1
      setLogIndex(next)

      const log = validationLogs[next]
      if (log.event) {
        setScatterEvents(prev => [...prev, log.event])
      }

      if (next >= validationLogs.length - 1) {
        setTimeout(() => setShowResults(true), 1000)
        setTimeout(() => setShowVerdict(true), 2500)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [logIndex])

  const handleSkip = () => {
    setLogIndex(validationLogs.length - 1)
    const allEvents = validationLogs.filter(l => l.event).map(l => l.event)
    setScatterEvents(allEvents)
    setShowResults(true)
    setShowVerdict(true)
  }

  // Listen for global skip event from App.jsx tab bar
  useEffect(() => {
    const handler = () => handleSkip()
    window.addEventListener('skip-animation', handler)
    return () => window.removeEventListener('skip-animation', handler)
  }, [])

  useEffect(() => { setLogIndex(0) }, [])

  return (
    <div className="h-full flex flex-col pt-12 px-6">
      {/* Hidden ValidateLog — keeps ref/scroll logic for skip-animation */}
      <ValidateLog logs={validationLogs} currentIndex={logIndex} />

      {/* Top: Checklist + Scatter */}
      <div className="flex gap-0 min-h-0" style={{ height: showResults ? '55%' : '85%', transition: 'height 0.5s ease' }}>
        {/* Left panel — ~40% */}
        <div style={{ width: '40%', paddingRight: '16px', overflow: 'hidden' }}>
          <ValidationChecklist logs={validationLogs} currentIndex={logIndex} />
        </div>

        <div className="w-px" style={{ background: 'var(--border-default)' }} />

        {/* Right panel — ~60% */}
        <div style={{ width: '60%', paddingLeft: '16px', overflow: 'hidden' }}>
          <BacktestScatter events={scatterEvents} />
        </div>
      </div>

      {/* Bottom: Metrics + Verdict */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <div className="flex gap-4">
              {validationMetrics.map((m, i) => (
                <MetricCard key={m.label} {...m} delay={i * 0.2} />
              ))}
            </div>
            {showVerdict && <VerdictBanner passed={true} onNext={onNext} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
