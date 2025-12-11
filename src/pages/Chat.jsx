import { Link } from "react-router-dom"

export default function ChatHub() {
  return (
    <main className="chat-hub">
      <section className="chat-hub-hero">
        <h1>Where history answers back</h1>
        <p>
          Talk to historical figures, explore the stories behind real places, and let our resident raven scholar, Quotha, help you make
          sense of it all.
        </p>
      </section>

      <section className="chat-hub-grid">
        <article className="chat-card">
          <h2>Chat with historical figures</h2>
          <p>
            Start a conversation with curated figures connected to real places in time. Ideal for exploring specific battles, cities,
            and turning points.
          </p>
          <a href="https://places-in-time-chatbot.onrender.com" className="chat-card-button">
            Launch figure chat
          </a>
        </article>

        <article className="chat-card">
          <h2>Log in or register</h2>
          <p>
            Create an account to keep your conversations, save favourites, and unlock richer context powered by our full history engine.
          </p>
          <a
            href="https://places-in-time-chatbot.onrender.com/login"
            className="chat-card-button chat-card-button-secondary"
          >
            Go to login and registration
          </a>
        </article>

        <article className="chat-card chat-card-quotha">
          <h2>Meet Quotha, the raven scholar</h2>
          <p>
            Quotha is your calm, exacting guide to the past. Ask him to untangle confusing sources, challenge bad history, or suggest
            what to read next.
          </p>
          <a href="https://places-in-time-chatbot.onrender.com?figure=quotha" className="chat-card-button">
            Chat with Quotha
          </a>
          <p className="chat-card-note">
            Quotha is in early access. Behaviour and style may evolve as we refine his training.
          </p>
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
