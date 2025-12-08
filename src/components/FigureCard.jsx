import { Link } from 'react-router-dom'

const truncateSummary = (text = '', max = 150) => {
  const clean = text.trim()
  if (!clean) return ''
  const snippet = clean.length > max ? clean.slice(0, max).trimEnd() : clean
  return `${snippet}…`
}

const FigureCard = ({ figure }) => {
  if (!figure) {
    return null
  }

  const {
    slug,
    era = 'Era soon',
    name = 'Unnamed figure',
    summary = 'Details arriving soon.',
    image,
    accent = 'medieval',
  } = figure

  const preview = truncateSummary(summary)

  return (
    <article className="figure-card">
      {image && (
        <img
          src={image}
          alt={`Portrait of ${name}`}
          loading="lazy"
        />
      )}
      <span className={`era-chip ${accent}`}>{era}</span>
      <h3>{name}</h3>
      {preview && <p>{preview}</p>}
      {slug && (
        <Link to={`/people/${slug}`} className="pill-button">
          Read more
        </Link>
      )}
    </article>
  )
}

export default FigureCard
