import { Link } from "react-router-dom"

const FIGURES = [
  { slug: "quotha", name: "Quotha", path: "/people/quotha" },
]

export default function ChatChooseFigure() {
  return (
    <main className="figure-page">
      <header className="figure-hero">
        <h1>Choose a figure</h1>
        <p className="figure-subtitle">Pick a figure, open their page, then click the chat button.</p>
      </header>

      <section className="figure-body">
        <div className="figure-cta-row">
          <Link className="figure-cta" to="/login">
            Log in
          </Link>
          <Link className="figure-cta figure-cta-secondary" to="/register">
            Register
          </Link>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Figures</h2>
        <ul>
          {FIGURES.map((figure) => (
            <li key={figure.slug}>
              <Link to={figure.path}>{figure.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
