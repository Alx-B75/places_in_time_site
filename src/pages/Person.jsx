import { Link, useParams } from 'react-router-dom'
import { FIGURES } from '../data/figures'

const Person = () => {
  const { slug } = useParams()
  const figure = FIGURES.find((entry) => entry.slug === slug)

  if (!figure) {
    return (
      <section className="detail-page">
        <h1>Person not found</h1>
        <p>The chronicles you seek may sit under a different name.</p>
        <Link className="button" to="/people">
          Back to all people
        </Link>
      </section>
    )
  }

  return (
    <article className="detail-page">
      <p className="eyebrow">{figure.primaryEra}</p>
      <h1>{figure.name}</h1>
      <p className="lead">{figure.teaser}</p>
      <section className="echoes">
        <h2>Why they matter</h2>
        <p>
          Letters, proclamations, and folklore capture how their decisions
          steered dynasties, raised monuments, and reshaped belief across these
          islands.
        </p>
      </section>
      <Link className="button" to="/people">
        Back to all people
      </Link>
    </article>
  )
}

export default Person
