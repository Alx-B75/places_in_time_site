import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { HistoricalFigure } from '../api/apiClient'
import { FIGURES } from '../data/figures'
import { resolveMediaUrl } from '../utils/media'

const fallbackFigureImage = '/images/figure-fallback.svg'

type LegacyFigureFields = {
  era_primary?: string
  primaryEra?: string
  summary?: string
  teaser?: string
  imageUrl?: string
}

type FigureDisplay = HistoricalFigure & LegacyFigureFields

const buildEra = (figure: Partial<HistoricalFigure & { era_primary?: string; primaryEra?: string }>): string =>
  figure.era ?? figure.era_primary ?? figure.primaryEra ?? ''

const formatLifespan = (figure: FigureDisplay): string | null => {
  const hasBirth = typeof figure.birth_year === 'number'
  const hasDeath = typeof figure.death_year === 'number'
  if (hasBirth || hasDeath) {
    const birth = hasBirth ? figure.birth_year : '?'
    const death = hasDeath ? figure.death_year : '?'
    return `${birth ?? '?'} – ${death ?? '?'}`
  }

  const hasFloruitStart = typeof figure.floruit_start_year === 'number'
  const hasFloruitEnd = typeof figure.floruit_end_year === 'number'
  if (hasFloruitStart || hasFloruitEnd) {
    const start = hasFloruitStart ? figure.floruit_start_year : '?'
    const end = hasFloruitEnd ? figure.floruit_end_year : '?'
    return `fl. ${start ?? '?'} – ${end ?? '?'}`
  }

  return null
}

const buildMetaLine = (figure: FigureDisplay): string => {
  const lifespan = formatLifespan(figure)
  const eraLabel = figure.era_label ?? buildEra(figure)
  const meta = [lifespan, eraLabel].filter(Boolean).join(' • ')
  return meta || 'Era forthcoming'
}

const buildTeaser = (
  figure: Partial<HistoricalFigure & { summary?: string; teaser?: string }>,
): string => figure.short_summary ?? figure.teaser ?? figure.summary ?? 'Profile coming soon.'

const People = () => {
  const [figures, setFigures] = useState<HistoricalFigure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchFigures = async () => {
      try {
        const data = await api.listFigures()
        if (!cancelled) {
          setFigures(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load people')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchFigures()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="list-page">
        <div className="page-header">
          <p className="eyebrow">People</p>
          <h1>Meet the figures who shaped the isles</h1>
          <p>
            Monarchs, commanders, abbesses, and chroniclers connect the sites as a living network of influence.
          </p>
        </div>
        <p>Loading people…</p>
      </section>
    )
  }

  const activeFigures: FigureDisplay[] =
    (figures.length > 0 ? figures : (FIGURES as FigureDisplay[])) as FigureDisplay[]

  return (
    <section className="list-page">
      <div className="page-header">
        <p className="eyebrow">People</p>
        <h1>Meet the figures who shaped the isles</h1>
        <p>
          Monarchs, commanders, abbesses, and chroniclers connect the sites as a living network of influence.
        </p>
      </div>
      {error && <p className="error-state">{error}</p>}
      {activeFigures.length === 0 ? (
        <p>No figures available yet.</p>
      ) : (
        <ul className="card-list">
          {activeFigures.map((figure) => {
            const portrait = figure.image_url ?? figure.imageUrl
            const portraitSrc = resolveMediaUrl(portrait) ?? fallbackFigureImage
            const metaLine = buildMetaLine(figure)
            const teaser = buildTeaser(figure)

            return (
              <li key={figure.slug} className="card">
                <Link to={`/people/${figure.slug}`}>
                  {portraitSrc && (
                    <div className="place-card-image">
                      <img src={portraitSrc} alt={`Portrait of ${figure.name}`} loading="lazy" />
                    </div>
                  )}
                  <p className="card-eyebrow">{metaLine}</p>
                  <h2>{figure.name}</h2>
                  <p>{teaser}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default People
