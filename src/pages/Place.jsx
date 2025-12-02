import { Link, useParams } from 'react-router-dom'
import { PLACES } from '../data/places'

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

  return (
    <article className="detail-page">
      <p className="eyebrow">
        {place.siteType} · {place.primaryEra}
      </p>
      <h1>{place.name}</h1>
      <p className="lead">{place.teaser}</p>
      <dl className="detail-meta">
        <div>
          <dt>Country</dt>
          <dd>{place.country}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{place.region}</dd>
        </div>
      </dl>
      <section className="echoes">
        <h2>Echoes from the Past</h2>
        <p>
          Chronicles, oral histories, and excavations give voice to the clash of
          crowns, saints, and settlers whose footsteps linger here.
        </p>
      </section>
      <Link className="button" to="/places">
        Back to all places
      </Link>
    </article>
  )
}

export default Place
