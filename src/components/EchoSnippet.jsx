const EchoSnippet = ({ snippet }) => {
  if (!snippet) {
    return null
  }

  const { text = '/* TODO: add echo */', source = 'Unknown source' } = snippet

  return (
    <article className="echo-snippet">
      <p>{text}</p>
      <cite aria-label="echo source">— {source}</cite>
    </article>
  )
}

export default EchoSnippet
