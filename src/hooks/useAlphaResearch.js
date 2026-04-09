import { useState, useCallback, useRef } from 'react'
import cachedRuns from '../data/cachedRuns.json'

const API_BASE = 'http://localhost:8888'

export default function useAlphaResearch() {
  const [status, setStatus] = useState('idle') // idle | running | completed | error
  const [logs, setLogs] = useState([])
  const [digData, setDigData] = useState(null)
  const [extractData, setExtractData] = useState(null)
  const [validateData, setValidateData] = useState(null)
  const [scanData, setScanData] = useState(null)
  const [actData, setActData] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [error, setError] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(null)
  const eventSourceRef = useRef(null)

  const reset = useCallback(() => {
    setStatus('running')
    setLogs([])
    setDigData(null)
    setExtractData(null)
    setValidateData(null)
    setScanData(null)
    setActData(null)
    setEventData(null)
    setError(null)
    setCurrentPhase('dig')
  }, [])

  // Replay cached data with simulated streaming delay
  const replayCache = useCallback((cached) => {
    reset()
    setEventData(cached.event)

    // Stream logs one by one with delay for demo effect
    const allLogs = cached.logs || []
    let i = 0
    const interval = setInterval(() => {
      if (i < allLogs.length) {
        const log = allLogs[i]
        i++
        setLogs(prev => [...prev, log])
      } else {
        clearInterval(interval)
        // After logs finish, reveal each phase with small delays
        setDigData(cached.dig)
        setCurrentPhase('extract')
        setTimeout(() => {
          setExtractData(cached.extract)
          setCurrentPhase('validate')
        }, 300)
        setTimeout(() => {
          if (cached.validate) {
            setValidateData(cached.validate)
          }
        }, 600)
        setTimeout(() => {
          if (cached.scan) {
            setScanData(cached.scan)
            setCurrentPhase('scan')
          }
        }, 900)
        setTimeout(() => {
          if (cached.act) {
            setActData(cached.act)
          }
          if (cached.scan) {
            setScanData(cached.scan)
          }
          setStatus('completed')
          setCurrentPhase('done')
        }, 1200)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [reset])

  const start = useCallback(async (query) => {
    // Extract token: uppercase ticker, or first capitalized/all-caps word, or first word
    const tokenMatch = query.match(/\b([A-Z]{2,10})\b/) || query.match(/\b([A-Za-z]{2,10})\b/)
    const token = tokenMatch ? tokenMatch[1].toUpperCase() : query.trim().split(/\s+/)[0].toUpperCase()

    // Check cache first — instant demo for known tokens
    if (cachedRuns[token]) {
      replayCache(cachedRuns[token])
      return
    }

    // Extract date: "March 2025", "Oct 2024", "2026-02", etc.
    const dateMatch = query.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i)
      || query.match(/(\d{4}[-/]\d{1,2})/)

    // Default: 3 months ago to now
    const now = new Date()
    let from_date = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().slice(0, 10)
    let to_date = now.toISOString().slice(0, 10)

    if (dateMatch) {
      const raw = dateMatch[1].replace('/', '-')
      const d = new Date(raw)
      if (!isNaN(d)) {
        const y = d.getFullYear()
        const m = d.getMonth()
        from_date = `${y}-${String(m + 1).padStart(2, '0')}-01`
        const lastDay = new Date(y, m + 1, 0).getDate()
        to_date = `${y}-${String(m + 1).padStart(2, '0')}-${lastDay}`
      }
    }

    reset()

    try {
      const res = await fetch(`${API_BASE}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, from_date, to_date }),
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const { run_id } = await res.json()

      // Connect SSE
      if (eventSourceRef.current) eventSourceRef.current.close()
      const es = new EventSource(`${API_BASE}/api/stream/${run_id}`)
      eventSourceRef.current = es

      es.addEventListener('log', (e) => {
        const data = JSON.parse(e.data)
        setLogs(prev => [...prev, data])
      })

      es.addEventListener('event_confirmed', (e) => {
        setEventData(JSON.parse(e.data))
      })

      es.addEventListener('dig', (e) => {
        setDigData(JSON.parse(e.data))
        setCurrentPhase('extract')
      })

      es.addEventListener('extract', (e) => {
        setExtractData(JSON.parse(e.data))
        setCurrentPhase('validate')
      })

      es.addEventListener('validate', (e) => {
        setValidateData(JSON.parse(e.data))
        setCurrentPhase('scan')
      })

      es.addEventListener('scan', (e) => {
        setScanData(JSON.parse(e.data))
        setCurrentPhase('act')
      })

      es.addEventListener('act', (e) => {
        setActData(JSON.parse(e.data))
      })

      es.addEventListener('done', () => {
        setStatus('completed')
        setCurrentPhase('done')
        es.close()
      })

      es.addEventListener('error', (e) => {
        try {
          const data = JSON.parse(e.data)
          setError(data.message)
        } catch {
          setError('Connection lost')
        }
        setStatus('error')
        es.close()
      })

      es.onerror = () => {
        if (es.readyState === EventSource.CLOSED) return
        setError('SSE connection failed')
        setStatus('error')
        es.close()
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [reset, replayCache])

  const stop = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setStatus('idle')
  }, [])

  return {
    status, logs, digData, extractData, validateData, scanData, actData,
    eventData, error, currentPhase, start, stop,
  }
}
