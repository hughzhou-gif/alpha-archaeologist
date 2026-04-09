import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import AgentIcon from '../components/AgentIcon'

const scanLogs = [
  { time: '12:00:01', agent: 'Scanner', icon: 'search', agentColor: 'var(--accent-primary)', message: 'Loading validated Pattern #P-2025-031 "Silent Accumulation + Catalyst"' },
  { time: '12:00:02', agent: 'Scanner', icon: 'search', agentColor: 'var(--accent-primary)', message: 'Scanning 2,847 tokens across DeFi, L2, and RWA sectors...' },
  { time: '12:00:04', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Checking whale wallet activity for top 500 tokens...' },
  { time: '12:00:07', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Found whale accumulation in: PENDLE, EIGEN, ETHFI, RPL, SSV' },
  { time: '12:00:08', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Filtering: 5 tokens pass Signal A (whale accumulation)' },
  { time: '12:00:10', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'Checking Snapshot + Tally for 5 candidate tokens...' },
  { time: '12:00:13', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'PENDLE: Snapshot #52 (revenue share v2) — passed 2 days ago' },
  { time: '12:00:14', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'EIGEN: EIP restaking rewards proposal — passed 3 days ago' },
  { time: '12:00:15', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'ETHFI: No recent governance activity' },
  { time: '12:00:16', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'RPL: Tokenomics proposal submitted but not yet voted' },
  { time: '12:00:17', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'SSV: No recent governance activity' },
  { time: '12:00:19', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'Scanning 500 KOL accounts for mentions of candidate tokens...' },
  { time: '12:00:22', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'PENDLE: @DeFiResearcher posted analysis yesterday (72% hit rate)' },
  { time: '12:00:23', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'EIGEN: @EigenInsider posted thread (65% hit rate)' },
  { time: '12:00:24', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'ETHFI: @LidoMaxi posted analysis (61% hit rate)' },
  { time: '12:00:26', agent: 'Market', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: 'Checking volume anomalies for remaining candidates...' },
  { time: '12:00:28', agent: 'Market', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: 'No volume spikes detected yet — Signal D pending for all tokens' },
  { time: '12:00:30', agent: 'Scanner', icon: 'search', agentColor: 'var(--accent-primary)', message: 'Scan complete. 3 tokens currently matching pattern:' },
  { time: '12:00:31', agent: 'Scanner', icon: 'target', agentColor: 'var(--semantic-positive)', message: 'PENDLE — 3/4 signals confirmed (whale + governance + social)', isHighlight: true },
  { time: '12:00:32', agent: 'Scanner', icon: 'target', agentColor: 'var(--semantic-positive)', message: 'EIGEN — 3/4 signals confirmed (whale + governance + social)', isHighlight: true },
  { time: '12:00:33', agent: 'Scanner', icon: 'target', agentColor: 'var(--semantic-positive)', message: 'ETHFI — 2/4 signals confirmed (whale + social)', isHighlight: true },
]

// Token cards that appear on the right as they're discovered
const discoveredTokens = [
  { logIndex: 18, token: 'PENDLE', matched: 3, total: 4, signals: ['onchain', 'governance', 'social'] },
  { logIndex: 19, token: 'EIGEN', matched: 3, total: 4, signals: ['onchain', 'governance', 'social'] },
  { logIndex: 20, token: 'ETHFI', matched: 2, total: 4, signals: ['onchain', 'social'] },
]

const SIGNAL_COLORS = {
  onchain: 'var(--signal-onchain)',
  social: 'var(--signal-social)',
  governance: 'var(--signal-governance)',
  market: 'var(--signal-market)',
}

const SIGNAL_LABELS = {
  onchain: 'On-Chain',
  social: 'Social',
  governance: 'Gov',
  market: 'Market',
}

function ScanLog({ currentIndex }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [currentIndex])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4" style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
        MARKET SCAN
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
        {scanLogs.slice(0, currentIndex + 1).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex gap-3 py-1.5 px-2 rounded"
            style={{
              borderLeft: log.isHighlight ? '3px solid var(--semantic-positive)' : '3px solid transparent',
              background: log.isHighlight ? 'rgba(0,200,83,0.04)' : 'transparent',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', flexShrink: 0 }}>{log.time}</span>
            <AgentIcon name={log.icon} color={log.agentColor} />
            <span style={{ color: log.agentColor, flexShrink: 0, fontWeight: 600, fontSize: '12px' }}>{log.agent}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{log.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TokenCard({ token, matched, total, signals }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="rounded-[12px] p-4 transition-all duration-200"
      style={{
        background: 'var(--bg-2)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderLeft: '3px solid var(--semantic-positive)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.borderLeftColor = 'var(--semantic-positive)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {token}
        </div>
        <div className="px-2 py-0.5 rounded-full" style={{
          fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: 'var(--accent-primary)', background: 'var(--accent-primary-muted)',
        }}>
          {matched}/{total}
        </div>
      </div>

      {/* Mini progress bar */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full" style={{
            background: i < matched ? 'var(--accent-primary)' : 'var(--border-default)',
          }} />
        ))}
      </div>

      {/* Signal tags */}
      <div className="flex gap-1.5 flex-wrap">
        {signals.map(s => (
          <span key={s} className="px-3 py-1 rounded-full" style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600,
            color: SIGNAL_COLORS[s], background: `${SIGNAL_COLORS[s]}15`,
          }}>
            {SIGNAL_LABELS[s]}
          </span>
        ))}
        {matched < total && (
          <span className="px-3 py-1 rounded-full" style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600,
            color: 'var(--text-tertiary)', background: 'var(--surface-hover)',
          }}>
            <Clock size={10} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{total - matched} pending
          </span>
        )}
      </div>
    </motion.div>
  )
}

function ScanProgress({ current, total, done }) {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <div className="h-12 flex items-center justify-between px-6" style={{
      background: 'var(--bg-2)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        {done ? `Scan complete. 3 tokens matching pattern.` : `Scanning market... ${Math.round(pct)}%`}
      </div>
      <div className="w-[200px] h-2 rounded-full overflow-hidden relative" style={{ background: 'var(--border-default)' }}>
        <div className="h-full rounded-full transition-all duration-500 relative overflow-hidden" style={{ width: `${pct}%`, background: 'var(--accent-primary)' }}>
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

export default function Page5Scan({ onNext }) {
  const [logIndex, setLogIndex] = useState(-1)
  const [visibleTokens, setVisibleTokens] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (logIndex >= scanLogs.length - 1) return
    const delay = 500 + Math.random() * 500
    const timer = setTimeout(() => {
      const next = logIndex + 1
      setLogIndex(next)

      const found = discoveredTokens.find(t => t.logIndex === next)
      if (found) setVisibleTokens(prev => [...prev, found])

      if (next >= scanLogs.length - 1) setDone(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [logIndex])

  const handleSkip = () => {
    setLogIndex(scanLogs.length - 1)
    setVisibleTokens(discoveredTokens)
    setDone(true)
  }

  // Listen for global skip event from App.jsx tab bar
  useEffect(() => {
    const handler = () => handleSkip()
    window.addEventListener('skip-animation', handler)
    return () => window.removeEventListener('skip-animation', handler)
  }, [])

  useEffect(() => { setLogIndex(0) }, [])

  return (
    <div className="h-full flex flex-col pt-12">
      <div className="flex-1 flex min-h-0">
        {/* Left: Scan Log */}
        <div className="w-[50%] p-6 overflow-hidden">
          <div className="h-full rounded-[14px] p-4" style={{
            background: 'var(--bg-2)',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}>
            <ScanLog currentIndex={logIndex} />
          </div>
        </div>

        <div className="w-px" style={{ background: 'var(--border-default)' }} />

        {/* Right: Discovered tokens */}
        <div className="w-[50%] p-6 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div style={{ color: 'var(--text-tertiary)', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
              MATCHES FOUND
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {visibleTokens.length}
            </div>
          </div>

          {visibleTokens.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center rounded-[14px] px-8 py-6" style={{
                background: 'var(--bg-2)',
                border: '0.5px solid rgba(255,255,255,0.08)',
              }}>
                <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
                <div className="mt-3" style={{ fontSize: '14px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  Scanning 2,847 tokens...
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto">
              {visibleTokens.map(t => (
                <TokenCard key={t.token} {...t} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ScanProgress current={logIndex + 1} total={scanLogs.length} done={done} />

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 right-8"
          >
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-[12px] text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{ fontFamily: 'var(--font-mono)', background: 'var(--accent-primary)', animation: 'glow-pulse 2s infinite' }}
            >
              View Alerts →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
