import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../api'
import type { HistoricalFigure } from '../api/apiClient'
import { FIGURES } from '../data/figures'
import { PLACES } from '../data/places'
import { resolveMediaUrl } from '../utils/media'
import { getRelatedPlaceSlugs } from '../utils/figures'

const fallbackFigureImage = '/images/figure-fallback.svg'

type FigureLike = HistoricalFigure & {
  primaryEra?: string
  era_primary?: string
  summary?: string
  teaser?: string
  imageUrl?: string
}

const PLACE_NAME_MAP = new Map((PLACES ?? []).map((place) => [place.slug, place.name]))

const formatPlaceLabel = (slug: string): string => {
  const resolved = PLACE_NAME_MAP.get(slug)
  if (resolved) {
    return resolved
  }
  return slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

const buildEra = (figure: FigureLike): string =>
  figure.era ?? figure.primaryEra ?? figure.era_primary ?? ''

const buildTeaser = (figure: FigureLike): string =>
  figure.short_summary ?? figure.teaser ?? figure.summary ?? ''

const formatYear = (value?: number | null): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return ''
  }
  return value < 0 ? `${Math.abs(value)} BCE` : `${value} CE`
}

const formatLifespan = (birth?: number | null, death?: number | null): string | undefined => {
  const birthText = formatYear(birth)
  const deathText = formatYear(death)

  if (birthText && deathText) {
    return `${birthText} – ${deathText}`
  }

  if (birthText) return birthText
  if (deathText) return deathText
  return undefined
}

const formatRoles = (roles?: HistoricalFigure['roles']): string | undefined => {
  if (!roles) return undefined

  if (Array.isArray(roles)) {
    const cleaned = roles
      .filter((role): role is string => typeof role === 'string' && role.trim().length > 0)
      .map((role) => role.trim())
    return cleaned.length > 0 ? cleaned.join(', ') : undefined
  }

  if (typeof roles === 'string') {
    const trimmed = roles.trim()
    if (!trimmed) return undefined
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((role): role is string => typeof role === 'string' && role.trim().length > 0)
            .map((role) => role.trim())
          if (cleaned.length > 0) {
            return cleaned.join(', ')
          }
        }
      } catch {
        // fall through to returning the trimmed string
      }
    }
    return trimmed
  }

  return undefined
}

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

  const era = buildEra(figure)
  const teaser = buildTeaser(figure)
  const portrait = figure.image_url ?? figure.imageUrl
  const portraitSrc = resolveMediaUrl(portrait) ?? fallbackFigureImage
  const quote = figure.quote ?? null
  const lifespan = formatLifespan(figure.birth_year, figure.death_year)
  const rolesLine = formatRoles(figure.roles)
  const longBio = figure.long_bio ?? null
  const relatedPlaceSlugs = Array.from(new Set(getRelatedPlaceSlugs(figure)))
  const primaryPlaceSlug = relatedPlaceSlugs[0] ?? null
  const associatedPlaces =
    relatedPlaceSlugs.length > 0
      ? relatedPlaceSlugs.map((slug) => ({ slug, label: formatPlaceLabel(slug) }))
      : []
  const chatParams = new URLSearchParams({ figure_slug: figure.slug })
  if (primaryPlaceSlug) {
    chatParams.set('place_slug', primaryPlaceSlug)
  }
  const chatLink = `/chat?${chatParams.toString()}`
  const longBioParagraphs = longBio
    ? longBio
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0)
    : null

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

      <div className="button-row" style={{ justifyContent: 'flex-start' }}>
        <Link className="button primary" to={chatLink}>
          {`Talk to ${figure.name}`}
        </Link>
        <p className="chat-cta-note">Start a short guest chat session with limited questions.</p>
      </div>

      {(quote || associatedPlaces.length > 0 || lifespan || rolesLine) && (
        <section className="at-a-glance">
          <h2>At a glance</h2>
          {quote && (
            <blockquote className="figure-quote">
              <p>{quote}</p>
            </blockquote>
          )}
          <ul className="figure-fact-list">
            {associatedPlaces.length > 0 && (
              <li>
                <strong>Most associated with:</strong>{' '}
                {associatedPlaces.map((place, index) => (
                  <span key={place.slug ?? `${place.label}-${index}`}>
                    {place.slug ? (
                      <Link to={`/places/${place.slug}`}>{place.label}</Link>
                    ) : (
                      place.label
                    )}
                    {index < associatedPlaces.length - 1 && ', '}
                  </span>
                ))}
              </li>
            )}
            {lifespan && (
              <li>
                <strong>Lifespan:</strong> {lifespan}
              </li>
            )}
            {rolesLine && (
              <li>
                <strong>Roles:</strong> {rolesLine}
              </li>
            )}
          </ul>
        </section>
      )}

      {longBioParagraphs && longBioParagraphs.length > 0 ? (
        <section className="echoes">
          <h2>Life &amp; legacy</h2>
          {longBioParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ) : (
        <section className="echoes">
          <h2>Why they matter</h2>
          <p>
            Letters, proclamations, and folklore capture how their decisions steered dynasties, raised monuments, and
            reshaped belief across these islands.
          </p>
        </section>
      )}
      <Link className="button" to="/people">
        Back to all people
      </Link>
    </article>
  )
}

export default Person
