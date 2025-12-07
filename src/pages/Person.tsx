import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../api'
import type { HistoricalFigure } from '../api/apiClient'
import { FIGURES } from '../data/figures'
import { resolveMediaUrl } from '../utils/media'

const fallbackFigureImage = '/images/figure-fallback.svg'

type FigureLike = HistoricalFigure & { primaryEra?: string; imageUrl?: string }

const Person = () => {
  const { slug } = useParams<{ slug: string }>()
  const [figure, setFigure] = useState<FigureLike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!slug) {
      setError('Missing person identifier')
      setLoading(false)
      return () => {
        cancelled = true
      }
    }

    const fetchFigure = async () => {
      try {
        const data = await api.getFigure(slug)
        if (!cancelled) {
          setFigure(data)
          setNotFound(false)
          setError(null)
        }
      } catch (err) {
        if (cancelled) {
          return
        }

        const fallback = FIGURES.find((entry) => entry.slug === slug) as FigureLike | undefined

        if (err instanceof ApiError && err.status === 404 && !fallback) {
          setNotFound(true)
          setFigure(null)
          setError('Person not found')
        } else if (fallback) {
          setFigure(fallback)
          setNotFound(false)
          setError('Showing preview data while the live profile loads.')
        } else {
          setNotFound(false)
          setError(err instanceof Error ? err.message : 'Failed to load person')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchFigure()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <section className="detail-page">
        <p>Loading person…</p>
      </section>
    )
  }

  if (!figure) {
    return (
      <section className="detail-page">
        <h1>{notFound ? 'Person not found' : 'Unable to load person'}</h1>
        <p>{error ?? 'The chronicles you seek may sit under a different name.'}</p>
        <Link className="button" to="/people">
          Back to all people
        </Link>
      </section>
    )
  }

  const era = figure.era_primary ?? figure.primaryEra ?? ''
  const teaser = figure.teaser ?? figure.summary ?? ''
  const portrait = figure.image_url ?? figure.imageUrl
  const portraitSrc = resolveMediaUrl(portrait) ?? fallbackFigureImage

  return (
    <article className="detail-page person-detail">
      <header className="person-header">
        {portraitSrc && (
          <div className="person-portrait">
            <img src={portraitSrc} alt={`Portrait of ${figure.name}`} loading="lazy" />
          </div>
        )}
        <div>
          {era && <p className="eyebrow">{era}</p>}
          <h1>{figure.name}</h1>
          {teaser && <p className="lead">{teaser}</p>}
        </div>
      </header>

      {error && !notFound && <p className="error-state">{error}</p>}

      <section className="echoes">
        <h2>Why they matter</h2>
        <p>
          Letters, proclamations, and folklore capture how their decisions steered dynasties, raised monuments, and
          reshaped belief across these islands.
        </p>
      </section>
      <Link className="button" to="/people">
        Back to all people
      </Link>
    </article>
  )
}

export default Person
