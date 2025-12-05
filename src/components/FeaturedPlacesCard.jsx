const FeaturedPlacesCard = ({ place }) => {
  if (!place) {
    return null
  }

  return (
    <article className="featured-card">
      {place.era && <span className={`era-chip ${place.accent ?? 'modern'}`}>{place.era}</span>}
      <h3 className="featured-title">{place.title}</h3>
      <p>{place.summary}</p>
      <div className="card-meta">
        <strong>{place.location}</strong>
        <p>{place.highlight}</p>
      </div>
    </article>
  )
}

export default FeaturedPlacesCard
