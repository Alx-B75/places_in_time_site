import { Link } from 'react-router-dom'

const NewsCard = ({ item }) => {
  if (!item) {
    return null
  }

  const { dateLabel, category, title, summary, link, to, ctaLabel, image, sourceName } = item
  const label = ctaLabel ?? 'Read update'
  const imageAlt = title ? `${title} hero image` : 'News hero image'

  return (
    <article className="news-card">
      {image && (
        <div className="news-card-media">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}
      <span className="news-meta">
        <strong>{dateLabel ?? 'Coming soon'}</strong>
        <span>{category ?? 'Update'}</span>
      </span>
      <h3>{title}</h3>
      <p>{summary ?? 'More details arriving soon.'}</p>
      {sourceName && <p className="news-source">Source: {sourceName}</p>}
      {to ? (
        <Link className="news-link" to={to}>
          {label}
        </Link>
      ) :
        link ? (
          <a className="news-link" href={link} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : null}
    </article>
  )
}

export default NewsCard
