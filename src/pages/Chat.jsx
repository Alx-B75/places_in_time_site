import { useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function ChatHub() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const figureSlug = searchParams.get("figure_slug")?.trim()
    if (!figureSlug) {
      return
    }

    const personSlug = encodeURIComponent(figureSlug)
    const redirectParams = new URLSearchParams({ start_chat: "1" })
    const placeSlug = searchParams.get("place_slug")?.trim()
    if (placeSlug) {
      redirectParams.set("place_slug", placeSlug)
    }

    navigate(`/people/${personSlug}?${redirectParams.toString()}`, { replace: true })
  }, [navigate, searchParams])

  return (
    <main className="chat-hub">
      <section className="chat-hub-hero">
        <h1>Where history answers back</h1>
        <p>Choose a figure, then open their page and click the chat button to begin.</p>
      </section>

      <section className="chat-hub-grid">
        <article className="chat-card">
          <h2>Chat with historical figures</h2>
          <p>Pick a figure first. Then use their page to start the chat.</p>
          <button type="button" className="chat-card-button" onClick={() => navigate("/chat/choose")}>
            Choose a figure
          </button>
        </article>

        <article className="chat-card">
          <h2>Log in or register</h2>
          <p>Log in to save chats and unlock richer context.</p>
          <div className="chat-cta-row">
            <Link className="chat-card-button chat-card-button-secondary" to="/login">
              Log in
            </Link>
            <Link className="chat-card-button" to="/register">
              Register
            </Link>
          </div>
        </article>

        <article className="chat-card chat-card-quotha">
          <h2>Meet Quotha</h2>
          <p>
            Quotha is the scholarly raven of Places in Time — calm, precise, and mildly unimpressed by bad history.
          </p>
          <Link className="chat-card-button" to="/people/quotha">
            Visit Quotha’s page
          </Link>
        </article>
      </section>

      <section className="chat-hub-footer">
        <p>
          Prefer to explore places first? <Link to="/places">Browse the map of Places in Time</Link>.
        </p>
      </section>
    </main>
  )
}
