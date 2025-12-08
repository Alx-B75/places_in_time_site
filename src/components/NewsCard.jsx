import { Link } from 'react-router-dom'

const NewsCard = ({ item }) => {
  if (!item) {
    return null
  }

  const { dateLabel, category, title, summary, link, to, ctaLabel } = item
  const label = ctaLabel ?? 'Read update'

  return (
    <article className="news-card">
      <span className="news-meta">
        <strong>{dateLabel ?? 'Coming soon'}</strong>
        <span>{category ?? 'Update'}</span>
      </span>
      <h3>{title}</h3>
      <p>{summary ?? 'More details arriving soon.'}</p>
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
