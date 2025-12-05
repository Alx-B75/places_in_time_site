const FeaturedPlacesCard = ({ place }) => {
  if (!place) {
    return null
  }

  const {
    era,
    accent = 'modern',
    title = 'Untitled place',
    summary = '/* TODO: add real summary */',
    location = 'Location forthcoming',
    highlight,
  } = place

  return (
    <article className="featured-card">
      {era && <span className={`era-chip ${accent}`}>{era}</span>}
      <h3 className="featured-title">{title}</h3>
      <p>{summary}</p>
      <div className="card-meta">
        <strong>{location}</strong>
        {highlight && <p>{highlight}</p>}
      </div>
    </article>
  )
}

export default FeaturedPlacesCard
