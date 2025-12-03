import { Link } from 'react-router-dom'
import { PLACES } from '../data/places'

const buildLocation = (place) => {
  if (place.location_label) return place.location_label
  if (place.locationLabel) return place.locationLabel
  if (place.region || place.country) {
    return [place.region, place.country].filter(Boolean).join(', ')
  }
  return ''
}

const buildEra = (place) => place.era_range ?? place.eraRange ?? place.primaryEra ?? ''

const getSummary = (place) => {
  const text =
    place.summaries?.gen ?? place.summary ?? place.teaser ?? place.description ?? ''
  if (text.length <= 190) return text
  return `${text.slice(0, 187).trimEnd()}…`
}

const Places = () => {
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
      <ul className="card-list places-list">
        {PLACES.map((place) => (
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
    </section>
  )
}

export default Places
