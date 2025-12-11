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

type MiniTimelineItem = {
  label?: string
  text?: string
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

const parseJsonField = (value: unknown, fallback: unknown[] = []) => {
  if (!value) {
    return fallback
  }

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : fallback
    } catch {
      return fallback
    }
  }

  return fallback
}

const toStringArray = (value: unknown): string[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : String(entry ?? '')).trim())
      .filter((entry) => entry.length > 0)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }
    if (trimmed.startsWith('[')) {
      const parsed = parseJsonField(trimmed, [])
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry) => (typeof entry === 'string' ? entry : String(entry ?? '')).trim())
          .filter((entry) => entry.length > 0)
      }
    }
    return trimmed.split(',').map((segment) => segment.trim()).filter((segment) => segment.length > 0)
  }

  return []
}

const formatLifespan = (figure: FigureLike): string | null => {
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
  const lifespan = formatLifespan(figure)
  const eraLabel = figure.era_label ?? era
  const heroMetaLine = [lifespan, eraLabel].filter(Boolean).join(' • ')
  const knownFor = figure.known_for ?? teaser ?? null
  const summaryCopy = figure.summary ?? figure.short_summary ?? figure.summary_gen ?? teaser ?? ''
  const rolesList = toStringArray(figure.roles)
  const rolesLine = rolesList.length > 0 ? rolesList.join(', ') : undefined
  const relatedPlaceSlugs = Array.from(new Set(getRelatedPlaceSlugs(figure)))
  const primaryPlaceSlug = relatedPlaceSlugs[0] ?? null
  const associatedPlaceMetadata = toStringArray(figure.associated_places)
  const fallbackAssociatedPlaces =
    relatedPlaceSlugs.length > 0
      ? relatedPlaceSlugs.map((slug) => ({ slug, label: formatPlaceLabel(slug) }))
      : []
  const associatedPlaces =
    associatedPlaceMetadata.length > 0
      ? associatedPlaceMetadata.map((entry) => {
          const slugMatch = PLACE_NAME_MAP.has(entry) ? entry : undefined
          return {
            slug: slugMatch,
            label: slugMatch ? PLACE_NAME_MAP.get(entry) ?? entry : entry,
          }
        })
      : fallbackAssociatedPlaces
  const pronunciation = figure.pronunciation?.trim() ?? null
  const miniTimelineItems = (
    parseJsonField(figure.mini_timeline, []) as MiniTimelineItem[]
  ).filter((item) => item && (item.label || item.text))
  const lifeSummarySource = figure.summary_gen ?? figure.long_bio ?? null
  const lifeSummaryBlocks = lifeSummarySource
    ? lifeSummarySource
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0)
    : []
  const didYouKnow = figure.did_you_know?.trim() ?? null
  const talkTopics = toStringArray(figure.talk_topics)
  const relatedFigures = toStringArray(figure.related_figures)
  const chatParams = new URLSearchParams({ figure_slug: figure.slug })
  if (primaryPlaceSlug) {
    chatParams.set('place_slug', primaryPlaceSlug)
  }
  const chatLink = `/chat?${chatParams.toString()}`
  const talkTopicsCopy = talkTopics.length > 0 ? talkTopics : []
  const relatedFiguresCopy = relatedFigures.length > 0 ? relatedFigures : []

  const shouldShowAtGlance = Boolean(rolesLine || associatedPlaces.length > 0 || pronunciation)

  return (
    <article className="detail-page person-detail">
      <section className="person-hero">
        {portraitSrc && (
          <div className="person-hero-media">
            <img src={portraitSrc} alt={`Portrait of ${figure.name}`} loading="lazy" />
          </div>
        )}
        <div className="person-hero-body">
          {heroMetaLine && <p className="person-hero-meta">{heroMetaLine}</p>}
          <h1>{figure.name}</h1>
          {knownFor && <p className="person-hero-tagline">{knownFor}</p>}
          {summaryCopy && <p className="person-hero-summary">{summaryCopy}</p>}
          <div className="button-row" style={{ justifyContent: 'flex-start' }}>
            <Link className="button primary" to={chatLink}>
              {`Talk to ${figure.name}`}
            </Link>
          </div>
        </div>
      </section>

      {error && !notFound && <p className="error-state">{error}</p>}

      <section className="person-grid">
        {shouldShowAtGlance && (
          <div className="person-card">
            <h2>At a glance</h2>
            <dl className="person-fact-grid">
              {rolesLine && (
                <div>
                  <dt>Roles</dt>
                  <dd>{rolesLine}</dd>
                </div>
              )}
              {associatedPlaces.length > 0 && (
                <div>
                  <dt>Most associated with</dt>
                  <dd>
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
                  </dd>
                </div>
              )}
              {pronunciation && (
                <div>
                  <dt>Pronunciation</dt>
                  <dd>{pronunciation}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {miniTimelineItems.length > 0 && (
          <div className="person-card person-card-timeline">
            <h2>Mini timeline</h2>
            <ul className="person-timeline">
              {miniTimelineItems.map((item, index) => (
                <li key={`${item.label ?? 'timeline'}-${index}`}>
                  {item.label && <span className="person-timeline-label">{item.label}</span>}
                  {item.text && <p>{item.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="person-card">
          <h2>Life &amp; legacy</h2>
          {lifeSummaryBlocks.length > 0 ? (
            lifeSummaryBlocks.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>
              Letters, proclamations, and folklore capture how their decisions steered dynasties, raised monuments,
              and reshaped belief across these islands.
            </p>
          )}
        </div>

        {didYouKnow && (
          <div className="person-card">
            <h2>Did you know?</h2>
            <p>{didYouKnow}</p>
          </div>
        )}

        {talkTopicsCopy.length > 0 && (
          <div className="person-card">
            <h2>Talk to me about…</h2>
            <ul className="person-topics">
              {talkTopicsCopy.map((topic, index) => (
                <li key={`${topic}-${index}`}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {relatedFiguresCopy.length > 0 && (
          <div className="person-card">
            <h2>Related figures</h2>
            <ul className="person-related-list">
              {relatedFiguresCopy.map((name, index) => (
                <li key={`${name}-${index}`}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Link className="button" to="/people">
        Back to all people
      </Link>
    </article>
  )
}

export default Person
