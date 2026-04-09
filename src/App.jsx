import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TerminalSquare, Brain, Radar, Zap, Plus } from 'lucide-react'
import Page1Input from './pages/Page1Input'
import Page2Dig from './pages/Page2Dig'
import Page3Extract from './pages/Page3Extract'
import Page4Validate from './pages/Page4Validate'
import Page5Scan from './pages/Page5Scan'
import Page6Act from './pages/Page5Act'
import useAlphaResearch from './hooks/useAlphaResearch'

const pages = [Page1Input, Page2Dig, Page3Extract, Page4Validate, Page5Scan, Page6Act]
const pageNames = ['Input', 'Dig', 'Extract', 'Validate', 'Scan', 'Act']

const sidebarSections = [
  { label: 'Terminal', icon: TerminalSquare, pageRange: [0, 1] },
  { label: 'Intelligence', icon: Brain, pageRange: [2, 2] },
  { label: 'Scanning', icon: Radar, pageRange: [3, 4] },
  { label: 'Execution', icon: Zap, pageRange: [5, 5] },
]

const pageVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(1)
  const research = useAlphaResearch()

  // Auto-advance pages when pipeline phases complete
  useEffect(() => {
    const phaseToPage = { extract: 2, validate: 3, scan: 4, act: 5 }
    const target = phaseToPage[research.currentPhase]
    if (target && target > currentPage) {
      setDirection(1)
      setCurrentPage(target)
    }
  }, [research.currentPhase])

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection(1)
      setCurrentPage(p => p + 1)
    }
  }, [currentPage])

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1)
      setCurrentPage(p => p - 1)
    }
  }, [currentPage])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const navigateToPage = (index) => {
    setDirection(index > currentPage ? 1 : -1)
    setCurrentPage(index)
  }

  const handleSkip = () => {
    window.dispatchEvent(new CustomEvent('skip-animation'))
  }

  const getActiveSection = (pageIndex) => {
    return sidebarSections.findIndex(
      s => pageIndex >= s.pageRange[0] && pageIndex <= s.pageRange[1]
    )
  }

  const activeSectionIndex = getActiveSection(currentPage)
  const showSkip = [1, 3, 4].includes(currentPage)
  const CurrentPageComponent = pages[currentPage]

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 200,
          background: 'var(--bg-1)',
          borderRight: '0.5px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 16px 20px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            Alpha
            <br />
            Archaeologist
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              marginTop: 6,
              letterSpacing: '0.05em',
            }}
          >
            SYNTHETIC INTELLIGENCE V1.0
          </div>
        </div>

        {/* Section links */}
        <nav className="flex flex-col gap-1" style={{ padding: '0 8px', flex: 1 }}>
          {sidebarSections.map((section, i) => {
            const isActive = i === activeSectionIndex
            const Icon = section.icon
            return (
              <button
                key={section.label}
                onClick={() => navigateToPage(section.pageRange[0])}
                className="flex items-center gap-3 w-full text-left transition-colors duration-150"
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
                {section.label}
              </button>
            )
          })}
        </nav>

        {/* New Research button */}
        <div style={{ padding: '16px 12px' }}>
          <button
            onClick={() => { setDirection(-1); setCurrentPage(0) }}
            className="flex items-center justify-center gap-2 w-full transition-colors duration-150"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '0.5px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <Plus size={14} strokeWidth={1.5} />
            New Research
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Tab Bar */}
        <div
          className="flex items-center shrink-0"
          style={{
            height: 48,
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            padding: '0 4px',
          }}
        >
          <div className="flex items-center flex-1">
            {pageNames.map((name, i) => {
              const isActive = i === currentPage
              return (
                <button
                  key={name}
                  onClick={() => navigateToPage(i)}
                  className="relative transition-colors duration-150"
                  style={{
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', marginRight: 4 }}>{i + 1}.</span>
                  {name}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 16,
                        right: 16,
                        height: 2,
                        background: 'var(--accent-primary)',
                        borderRadius: '1px 1px 0 0',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Skip button */}
          {showSkip && (
            <button
              onClick={handleSkip}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-tertiary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              SKIP
            </button>
          )}
        </div>

        {/* Page content */}
        <div className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <CurrentPageComponent onNext={goNext} onPrev={goPrev} research={research} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
