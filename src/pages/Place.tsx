import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import type { Place } from '../api/apiClient'
import { ApiError } from '../api'

const buildLocation = (place: Place): string => {
  if (place.location_label) return place.location_label
  if (place.locationLabel) return place.locationLabel
  if (place.region || place.country) {
    return [place.region, place.country].filter(Boolean).join(', ')
  }
  return ''
}

const buildEra = (place: Place): string =>
  place.era_range ?? place.era_primary ?? place.primaryEra ?? ''

const getSummary = (place: Place): string =>
  place.summary_gen ?? place.summaries?.gen ?? place.summary ?? place.teaser ?? place.description ?? ''

const getTypes = (place: Place): string[] => {
  if (Array.isArray(place.types) && place.types.length > 0) return place.types
  if (place.siteType) return [place.siteType]
  return []
}

const formatYear = (value?: number): string => {
  if (typeof value !== 'number') {
    return ''
  }
  if (value < 0) {
    return `${Math.abs(value)} BCE`
  }
  return `${value} CE`
}

const buildTimeline = (start?: number, end?: number): string => {
  const startText = formatYear(start)
  const endText = formatYear(end)

  if (startText && endText) {
    if (startText === endText) {
      return startText
    }
    return `${startText} – ${endText}`
  }

  return startText || endText
}

const PlacePage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!slug) {
      setError('Missing place identifier')
      setLoading(false)
      return () => {
        cancelled = true
      }
    }

    const fetchPlace = async () => {
      try {
        const data = await api.getPlace(slug)
        if (!cancelled) {
          setPlace(data)
          setError(null)
          setNotFound(false)
        }
      } catch (err) {
        if (cancelled) {
          return
        }
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
          setError('Place not found')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load place')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPlace()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <section className="detail-page">
        <p>Loading place details…</p>
      </section>
    )
  }

  if (!place) {
    return (
      <section className="detail-page">
        <h1>{notFound ? 'Place not found' : 'Unable to load place'}</h1>
        <p>{error ?? 'Try another landmark to continue the journey.'}</p>
        <Link className="button" to="/places">
          Back to all places
        </Link>
      </section>
    )
  }

  const location = buildLocation(place)
  const era = buildEra(place)
  const summary = getSummary(place)
  const types = getTypes(place)
  const echoTitle = place.echo_title ?? place.echo?.title
  const echoText = place.echo_text ?? place.echo?.text
  const echoImage = place.echo_image ?? place.echoImage
  const heroImage = place.hero_image ?? place.heroImage
  const mapEmbed = place.map_google_embed ?? place.map?.google_embed ?? place.map?.googleEmbed
  const officialLink = place.link_official_site ?? place.links?.official_site ?? place.links?.officialSite
  const wikipediaLink = place.link_wikipedia ?? place.links?.wikipedia
  const timeline = buildTimeline(place.timeline_start, place.timeline_end)

  const facts = [
    { label: 'Location', value: location },
    { label: 'Era', value: era },
    { label: 'Type', value: types.join(', ') },
    { label: 'Timeline', value: timeline },
  ].filter((fact) => fact.value)

  return (
    <article className="detail-page place-detail">
      {heroImage && (
        <section className="place-hero">
          <img src={heroImage} alt={place.name} className="place-hero-image" />
        </section>
      )}
      <header className="place-header">
        {era && <p className="eyebrow">{era}</p>}
        <h1>{place.name}</h1>
        {location && <p className="place-location">{location}</p>}
      </header>
      {summary && <p className="lead">{summary}</p>}

      {facts.length > 0 && (
        <section className="fast-facts">
          <h2>Fast Facts</h2>
          <dl>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {(echoText || echoImage) && (
        <section className="echoes place-echo">
          <div className="place-echo-header">
            <h2>Echoes from the Past</h2>
            {echoTitle && <h3>{echoTitle}</h3>}
          </div>
          <div className="place-echo-body">
            {echoImage && (
              <div className="place-echo-media">
                <img
                  src={echoImage}
                  alt={echoTitle ? `${echoTitle} illustration` : `Echo from ${place.name}`}
                  loading="lazy"
                />
              </div>
            )}
            {echoText && (
              <div className="place-echo-text">
                <p>{echoText}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {mapEmbed && (
        <section className="map-section">
          <h2>Map &amp; Directions</h2>
          <div className="map-embed">
            <iframe
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title={`Map of ${place.name}`}
            />
          </div>
        </section>
      )}

      {(officialLink || wikipediaLink) && (
        <section className="links-section">
          <h2>Further Information</h2>
          <div className="external-links">
            {officialLink && (
              <a href={officialLink} target="_blank" rel="noreferrer">
                Official site
              </a>
            )}
            {wikipediaLink && (
              <a href={wikipediaLink} target="_blank" rel="noreferrer">
                Read more on Wikipedia
              </a>
            )}
          </div>
        </section>
      )}

      <Link className="button" to="/places">
        Back to all places
      </Link>
    </article>
  )
}

export default PlacePage
