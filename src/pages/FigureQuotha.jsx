export default function FigureQuotha() {
  return (
    <main className="figure-page">
      <header className="figure-hero">
        <h1>Quotha</h1>
        <p className="figure-subtitle">
          The scholarly raven of Places in Time - precise, calm, and mildly unimpressed by bad history.
        </p>
      </header>

      <section className="figure-body">
        <h2>What Quotha does</h2>
        <ul>
          <li>Explains what we actually know, and what we are guessing.</li>
          <li>Offers context, sources, and competing interpretations.</li>
          <li>Keeps the tone grounded: no propaganda, no myth-as-fact.</li>
        </ul>

        <div className="figure-cta-row">
          <a className="figure-cta" href="/chat-app?figure=quotha">
            Chat with Quotha
          </a>
          <a className="figure-cta figure-cta-secondary" href="/chat/choose">
            Chat with a historical figure instead
          </a>
        </div>
      </section>
    </main>
  )
}
