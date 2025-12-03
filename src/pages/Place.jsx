import { Link, useParams } from 'react-router-dom'
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

const getSummary = (place) =>
  place.summaries?.gen ?? place.summary ?? place.teaser ?? place.description ?? ''

const getTypes = (place) => {
  if (Array.isArray(place.types) && place.types.length > 0) return place.types
  if (place.siteType) return [place.siteType]
  return []
}

const Place = () => {
  const { slug } = useParams()
  const place = PLACES.find((entry) => entry.slug === slug)

  if (!place) {
    return (
      <section className="detail-page">
        <h1>Place not found</h1>
        <p>Try another landmark to continue the journey.</p>
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
  const echoTitle = place.echo?.title
  const echoText = place.echo?.text
  const mapEmbed = place.map?.google_embed ?? place.map?.googleEmbed
  const officialLink = place.links?.official_site ?? place.links?.officialSite
  const wikipediaLink = place.links?.wikipedia

  const facts = [
    { label: 'Location', value: location },
    { label: 'Era', value: era },
    { label: 'Type', value: types.join(', ') },
  ].filter((fact) => fact.value)

  return (
    <article className="detail-page place-detail">
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

      {echoText && (
        <section className="echoes">
          <h2>Echoes from the Past</h2>
          {echoTitle && <h3>{echoTitle}</h3>}
          <p>{echoText}</p>
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

export default Place
