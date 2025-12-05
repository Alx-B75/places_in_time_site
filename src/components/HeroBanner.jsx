const HeroBanner = ({ quote, chipLabel, chipTone = 'modern', description, caption }) => {
  return (
    <div className="hero-banner" aria-label="Key visual for Places in Time">
      <div>
        <p>{quote}</p>
        {chipLabel && <span className={`era-chip ${chipTone}`}>{chipLabel}</span>}
      </div>
      {description && <p>{description}</p>}
      {caption && <small>{caption}</small>}
      <div className="hero-overlay one" aria-hidden="true" />
      <div className="hero-overlay two" aria-hidden="true" />
    </div>
  )
}

export default HeroBanner
