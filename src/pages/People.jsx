import { Link } from 'react-router-dom'
import { FIGURES } from '../data/figures'

const People = () => {
  return (
    <section className="list-page">
      <div className="page-header">
        <p className="eyebrow">People</p>
        <h1>Meet the figures who shaped the isles</h1>
        <p>
          Monarchs, commanders, abbesses, and chroniclers connect the sites as a
          living network of influence.
        </p>
      </div>
      <ul className="card-list">
        {FIGURES.map((figure) => (
          <li key={figure.slug} className="card">
            <Link to={`/people/${figure.slug}`}>
              <p className="card-eyebrow">{figure.primaryEra}</p>
              <h2>{figure.name}</h2>
              <p>{figure.teaser}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default People
