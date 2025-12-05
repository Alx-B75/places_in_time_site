const EchoSnippet = ({ snippet }) => {
  if (!snippet) {
    return null
  }

  return (
    <article className="echo-snippet">
      <p>{snippet.text}</p>
      <cite>— {snippet.source}</cite>
    </article>
  )
}

export default EchoSnippet
