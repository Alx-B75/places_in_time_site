const FigureCard = ({ figure }) => {
  if (!figure) {
    return null
  }

  const {
    era = 'Era soon',
    name = 'Unnamed figure',
    title = '/* TODO: add role */',
    summary = '/* TODO: add bio */',
    image,
    accent = 'medieval',
  } = figure

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
      <p>{summary}</p>
      <small>{title}</small>
    </article>
  )
}

export default FigureCard
