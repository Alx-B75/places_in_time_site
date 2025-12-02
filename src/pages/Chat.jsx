const CHAT_BASE = 'https://places-in-time-history-chat-front.onrender.com'

const openChat = (path) => {
  window.open(`${CHAT_BASE}${path}`, '_blank', 'noopener,noreferrer')
}

const Chat = () => {
  return (
    <section className="chat-page">
      <p className="eyebrow">Talk to History</p>
      <h1>Talk to History</h1>
      <p>
        Step into a guided conversation with figures who witnessed these
        landscapes, whether you are sampling as a guest or signing in to keep
        your threads alive.
      </p>
      <div className="chat-actions">
        <button
          type="button"
          className="button primary"
          onClick={() => openChat('/guest/shakespeare')}
        >
          Start a guest chat
        </button>
        <button
          type="button"
          className="button"
          onClick={() => openChat('/login')}
        >
          Log in
        </button>
        <button
          type="button"
          className="button"
          onClick={() => openChat('/register')}
        >
          Register
        </button>
      </div>
    </section>
  )
}

export default Chat
