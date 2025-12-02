import { Link } from 'react-router-dom'
import { PLACES } from '../data/places'

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
      <ul className="card-list">
        {PLACES.map((place) => (
          <li key={place.slug} className="card">
            <Link to={`/places/${place.slug}`}>
              <p className="card-eyebrow">
                {place.siteType} · {place.primaryEra}
              </p>
              <h2>{place.name}</h2>
              <p>{place.teaser}</p>
              <span className="card-meta">
                {place.country}, {place.region}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Places
