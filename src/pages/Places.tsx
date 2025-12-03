import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Place } from '../api/apiClient'

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

const getSummary = (place: Place): string => {
  const text =
    place.summaries?.gen ?? place.summary ?? place.teaser ?? place.description ?? ''
  if (text.length <= 190) return text
  return `${text.slice(0, 187).trimEnd()}…`
}

const Places = () => {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchPlaces = async () => {
      try {
        const data = await api.listPlaces()
        if (!cancelled) {
          setPlaces(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load places')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPlaces()

    return () => {
      cancelled = true
    }
  }, [])

  const renderList = () => {
    if (loading) {
      return <p>Loading places…</p>
    }

    if (error) {
      return <p className="error-state">{error}</p>
    }

    if (places.length === 0) {
      return <p>No places available yet.</p>
    }

    return (
      <ul className="card-list places-list">
        {places.map((place) => (
          <li key={place.slug} className="card place-card">
            <Link to={`/places/${place.slug}`}>
              <div className="place-card-heading">
                <p className="card-eyebrow">{buildEra(place)}</p>
                <h2>{place.name}</h2>
                {buildLocation(place) && (
                  <p className="place-location">{buildLocation(place)}</p>
                )}
              </div>
              <p className="place-summary">{getSummary(place)}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="list-page">
      <div className="page-header">
        <p className="eyebrow">Places</p>
        <h1>Traverse pivotal ground</h1>
        <p>
          From windswept shores to fortified hilltops, these sites formed the
          stages for intrigue, rebellion, and resilience.
        </p>
      </div>
      {renderList()}
    </section>
  )
}

export default Places
