import { Link } from 'react-router-dom'

const FeaturedPlacesCard = ({ place }) => {
  if (!place) {
    return null
  }

  const {
    slug,
    era,
    accent = 'modern',
    title = 'Untitled place',
    summary = '/* TODO: add real summary */',
    location = 'Location forthcoming',
    highlight,
    image,
    imageAlt,
  } = place

  const destination = slug ? `/places/${slug}` : '/places'
  const cardImageAlt = imageAlt ?? `Hero view of ${title}`

  return (
    <Link to={destination} className="featured-card-link" aria-label={`View details for ${title}`}>
      <article className="featured-card">
        {image && (
          <div className="featured-card-image">
            <img src={image} alt={cardImageAlt} loading="lazy" />
          </div>
        )}
        {era && <span className={`era-chip ${accent}`}>{era}</span>}
        <h3 className="featured-title">{title}</h3>
        <p>{summary}</p>
        <div className="card-meta">
          <strong>{location}</strong>
          {highlight && <p>{highlight}</p>}
        </div>
      </article>
    </Link>
  )
}

export default FeaturedPlacesCard
