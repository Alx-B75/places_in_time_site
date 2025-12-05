const NewsCard = ({ item }) => {
  if (!item) {
    return null
  }

  return (
    <article className="news-card">
      <span className="news-meta">
        <strong>{item.dateLabel}</strong>
        <span>{item.category ?? 'Update'}</span>
      </span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      {item.link && (
        <a className="news-link" href={item.link} target="_blank" rel="noreferrer">
          Read update
        </a>
      )}
    </article>
  )
}

export default NewsCard
