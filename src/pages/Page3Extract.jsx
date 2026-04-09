import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Anchor, Landmark, MessageCircle, BarChart2, Clock, Target, ClipboardList } from 'lucide-react'
import { patternData as mockPatternData } from '../data/mockData'

const SOURCE_COLORS = {
  onchain: 'var(--signal-onchain)',
  social: 'var(--signal-social)',
  governance: 'var(--signal-governance)',
  market: 'var(--signal-market)',
}

const CATEGORY_ICONS = {
  onchain: { icon: Anchor, sourceType: 'onchain' },
  social: { icon: MessageCircle, sourceType: 'social' },
  governance: { icon: Landmark, sourceType: 'governance' },
  market: { icon: BarChart2, sourceType: 'market' },
  market_structure: { icon: BarChart2, sourceType: 'market' },
  news: { icon: MessageCircle, sourceType: 'social' },
  development: { icon: Landmark, sourceType: 'governance' },
}

const DEFAULT_PHASE_CONFIG = [
  { icon: Anchor, label: 'Whale Accumulation', phase: 'PHASE 1', sourceType: 'onchain' },
  { icon: Landmark, label: 'Governance Proposal', phase: 'PHASE 2', sourceType: 'governance' },
  { icon: MessageCircle, label: 'KOL Mention', phase: 'PHASE 3', sourceType: 'social' },
  { icon: BarChart2, label: 'Volume Spike', phase: 'TIMING', sourceType: 'market' },
]

function getPhaseConfig(signals) {
  // If mock data (4 signals matching default), use defaults
  if (signals.length === 4 && signals[0]?.sourceType === 'onchain') {
    return DEFAULT_PHASE_CONFIG
  }
  // Dynamic config from live/cache conditions
  return signals.map((sig, i) => {
    const cat = CATEGORY_ICONS[sig.sourceType] || CATEGORY_ICONS.onchain
    return {
      icon: cat.icon,
      label: sig.description || sig.id,
      phase: `PHASE ${i + 1}`,
      sourceType: cat.sourceType,
    }
  })
}

function PhaseNode({ config, signal, index, isVisible }) {
  const IconComp = config.icon
  const color = SOURCE_COLORS[config.sourceType]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2, type: 'spring', stiffness: 150 }}
          className="flex flex-col items-center"
          style={{ width: 140 }}
        >
          {/* Icon circle with dashed border */}
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              border: `2px dashed ${color}50`,
              background: `${color}08`,
            }}
          >
            <IconComp size={32} strokeWidth={1.5} style={{ color }} />
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginTop: 16 }}>
            {config.phase}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.3, marginTop: 8, fontWeight: 600 }}>
            {config.label}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
            {signal.timeWindow}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DottedLine({ isVisible, delay }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay }}
          className="flex-shrink-0"
          style={{ marginTop: -48, originX: 0 }}
        >
          <svg width="48" height="2" viewBox="0 0 48 2">
            <line x1="0" y1="1" x2="40" y2="1" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="40,0 48,1 40,2" fill="rgba(255,255,255,0.25)" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ReasoningPanel({ reasoning }) {
  return (
    <div className="mt-8" style={{ width: 720 }}>
      <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, marginBottom: 12 }}>
        Why this pattern?
      </div>
      <div className="p-5 rounded-[12px]" style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border-default)' }}>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          {reasoning}
        </p>
      </div>
    </div>
  )
}

export default function Page3Extract({ onNext, research }) {
  const liveExtract = research?.extractData
  // Convert live extract data to patternData shape
  const patternData = liveExtract ? {
    id: liveExtract.pattern_id || '#P-LIVE',
    name: liveExtract.name || 'Extracted Pattern',
    signals: (liveExtract.conditions || []).map((c, i) => ({
      id: String.fromCharCode(65 + i),
      timeWindow: c.day_range ? `Day ${c.day_range[0]} to ${c.day_range[1]}` : '',
      sourceType: c.category || 'onchain',
      description: c.description || c.signal_type,
      required: c.required,
    })),
    metadata: {
      window: `${liveExtract.time_window_days || 7} days`,
      minSignals: `${liveExtract.min_signals_required || 3} of ${(liveExtract.conditions || []).length}`,
      sourceEvent: 'Live analysis',
    },
    reasoning: liveExtract.reasoning || 'Pattern extracted from live pipeline analysis.',
  } : mockPatternData

  const [entered, setEntered] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => {
      if (visibleNodes < patternData.signals.length) {
        setVisibleNodes(v => v + 1)
      } else {
        setTimeout(() => setShowButton(true), 1000)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [entered, visibleNodes, patternData.signals.length])

  return (
    <div className="h-full flex flex-col items-center overflow-y-auto" style={{ padding: '48px 0' }}>
      {/* Title section — no card wrapper, directly on page */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={entered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center"
        style={{ maxWidth: 720 }}
      >
        <div style={{ fontSize: '11px', color: 'var(--accent-primary)', letterSpacing: '2px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          PATTERN EXTRACTION ACTIVE
        </div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '44px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', marginTop: 16, lineHeight: 1.1 }}>
          {patternData.name}
        </h2>
        <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '14px', marginTop: 12 }}>
          {patternData.id}
        </div>
      </motion.div>

      {/* Phase flow — open layout, no card wrapper */}
      <div className="flex items-start justify-center flex-wrap" style={{ marginTop: 48, gap: 8 }}>
        {patternData.signals.map((sig, i) => {
          const phaseConfig = getPhaseConfig(patternData.signals)
          return (
          <div key={sig.id} className="flex items-start" style={{ display: 'contents' }}>
            <PhaseNode config={phaseConfig[i]} signal={sig} index={i} isVisible={i < visibleNodes} />
            {i < patternData.signals.length - 1 && (
              <DottedLine isVisible={i < visibleNodes - 1} delay={i * 0.2 + 0.25} />
            )}
          </div>
          )
        })}
      </div>

      {/* Metrics row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center justify-center gap-12"
        style={{ marginTop: 48 }}
      >
        {[
          { icon: Clock, label: 'TIME WINDOW', value: patternData.metadata.window },
          { icon: Target, label: 'ACCURACY', value: '62.5%' },
          { icon: ClipboardList, label: 'MIN SIGNALS', value: patternData.metadata.minSignals },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
              <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
                {label}
              </div>
              <div style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: 2 }}>
                {value}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Reasoning panel */}
      <ReasoningPanel reasoning={patternData.reasoning} />

      {/* CTA button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <button
              onClick={onNext}
              className="px-10 py-4 rounded-full font-bold text-white cursor-pointer transition-all duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 32px rgba(255, 40, 130, 0.35)',
                fontSize: '16px',
                letterSpacing: '1px',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 48px rgba(255, 40, 130, 0.55)'; e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(255, 40, 130, 0.35)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              VALIDATE PATTERN →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
