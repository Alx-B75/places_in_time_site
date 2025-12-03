import { useEffect, useState } from 'react'
import { api } from '../api'
import type { HistoricalFigure } from '../api/apiClient'

const ApiDebug = () => {
  if (import.meta.env.PROD) {
    return null
  }

  const [health, setHealth] = useState<string>('pending')
  const [figures, setFigures] = useState<HistoricalFigure[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchDebugData = async () => {
      try {
        const healthResponse = await api.health()
        if (cancelled) {
          return
        }
        setHealth(healthResponse.status ?? 'unknown')

        const figuresResponse = await api.listFigures({ limit: 5 })
        if (cancelled) {
          return
        }
        setFigures(figuresResponse)
      } catch (err) {
        if (cancelled) {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load API data')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDebugData()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="api-debug">
      <h2>API Debug</h2>
      {loading && <p>Loading API status…</p>}
      {!loading && error && <p className="api-debug-error">{error}</p>}
      {!loading && !error && (
        <>
          <p>
            Health status: <strong>{health}</strong>
          </p>
          <h3>Sample figures</h3>
          {figures.length === 0 ? (
            <p>No figures returned.</p>
          ) : (
            <ul>
              {figures.map((figure) => (
                <li key={figure.slug}>{figure.name}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default ApiDebug
