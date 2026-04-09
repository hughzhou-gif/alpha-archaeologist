import { useState, useCallback, useRef } from 'react'

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

  const start = useCallback(async (query) => {
    // Parse query into API params — simple heuristic
    const tokenMatch = query.match(/\b([A-Z]{2,10})\b/)
    const token = tokenMatch ? tokenMatch[1] : query.split(' ')[0]
    const dateMatch = query.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i)
    const pctMatch = query.match(/[+-]?(\d+)%/)

    // Rough date range from the query
    let from_date = '2025-02-01'
    let to_date = '2025-03-15'
    if (dateMatch) {
      const d = new Date(dateMatch[1])
      if (!isNaN(d)) {
        const y = d.getFullYear()
        const m = d.getMonth()
        from_date = `${y}-${String(m + 1).padStart(2, '0')}-01`
        const lastDay = new Date(y, m + 1, 0).getDate()
        to_date = `${y}-${String(m + 1).padStart(2, '0')}-${lastDay}`
      }
    }

    // Reset state
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
        // SSE error event — could be connection or pipeline error
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
        // EventSource connection error — only if not already done
        if (es.readyState === EventSource.CLOSED) return
        setError('SSE connection failed')
        setStatus('error')
        es.close()
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

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
