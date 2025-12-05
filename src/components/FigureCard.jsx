const FigureCard = ({ figure }) => {
  if (!figure) {
    return null
  }

  return (
    <article className="figure-card">
      {figure.image && <img src={figure.image} alt={figure.name} loading="lazy" />}
      <span className="era-chip medieval">{figure.era}</span>
      <h3>{figure.name}</h3>
      <p>{figure.summary}</p>
      <small>{figure.title}</small>
    </article>
  )
}

export default FigureCard
