import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { exampleEvents } from '../data/mockData'

const cardAccentColors = [
  'var(--signal-onchain)',
  'var(--signal-social)',
  'var(--signal-governance)',
]

function EventInput({ value, onChange, onSubmit }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex items-center gap-3 w-[800px]">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-tertiary)' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && value.trim() && onSubmit()}
          aria-label="Describe a crypto alpha event"
          placeholder="Describe an event... e.g. PENDLE pumped 280% in March 2025"
          className="w-full h-14 pl-11 pr-5 rounded-[14px] text-base outline-none transition-all duration-300"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'var(--text-primary)',
            border: `1px solid ${focused ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
            boxShadow: focused ? '0 0 24px rgba(255, 40, 130, 0.15)' : 'none',
          }}
        />
      </div>
      <button
        onClick={() => value.trim() && onSubmit()}
        className="h-14 px-6 rounded-[14px] flex items-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap"
        aria-label="Analyze event"
        style={{
          background: 'var(--accent-primary)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          fontWeight: 600,
          minWidth: '140px',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 40, 130, 0.4)'
          e.currentTarget.style.transform = 'scale(1.03)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        Analyze
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

function ExampleCard({ title, date, magnitude, accentColor, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-1 rounded-[12px] text-left transition-all duration-200 cursor-pointer overflow-hidden"
      style={{
        background: 'var(--bg-2)',
        border: '0.5px solid rgba(255, 255, 255, 0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="flex">
        <div
          className="w-[3px] shrink-0 self-stretch rounded-l-[12px]"
          style={{ background: accentColor }}
        />
        <div style={{ padding: '20px' }}>
          <div
            className="font-bold"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '18px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              marginTop: '4px',
            }}
          >
            {date}
          </div>
          <div
            className="font-bold"
            style={{
              color: 'var(--semantic-positive)',
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              marginTop: '12px',
            }}
          >
            {magnitude}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

export default function Page1Input({ onNext }) {
  const [query, setQuery] = useState('')

  const handleSubmit = () => {
    if (query.trim()) onNext()
  }

  const handleExample = (ex) => {
    setQuery(ex.query)
    setTimeout(() => onNext(), 300)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1
          className="font-bold"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '64px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-2px',
          }}
        >
          Alpha Archaeologist
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '20px',
            marginTop: '16px',
            letterSpacing: '0.3px',
          }}
        >
          Auto-research system for crypto alpha discovery.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginTop: '40px' }}
      >
        <EventInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
      </motion.div>

      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '2px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          HISTORICAL ALPHA EXTRACTED
        </div>
        <div className="flex gap-4" style={{ width: '640px' }}>
          {exampleEvents.map((ex, i) => (
            <motion.div
              key={ex.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              className="flex-1"
            >
              <ExampleCard
                {...ex}
                accentColor={cardAccentColors[i % cardAccentColors.length]}
                onClick={() => handleExample(ex)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8"
        style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}
      >
        Powered by Surf
      </motion.div>
    </div>
  )
}
