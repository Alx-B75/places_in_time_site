import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatStore, startGuestSession } from '../chat/state/chatStore'
import { guestAsk } from '../chat/api/chatApiClient'
import { CHAT_API_BASE_URL } from '../config/chatApi'

const Chat = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const figureSlug = searchParams.get('figure_slug')
  const placeSlug = searchParams.get('place_slug')
  const { state, dispatch } = useChatStore()
  const {
    mode,
    loading,
    error,
    messages,
    currentThreadId,
    guestMode,
    sessionStarted,
    activeFigureSlug,
    activePlaceSlug,
    maxQuestions,
    remainingQuestions,
  } = state
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const sessionReady = guestMode && sessionStarted
  const isPreparing = mode === 'guest-starting' || (loading && !sessionReady)
  const hasError = Boolean(error)
  const normalizedRemaining =
    typeof remainingQuestions === 'number' ? Math.max(remainingQuestions, 0) : null
  const guestLimitExhausted = typeof normalizedRemaining === 'number' && normalizedRemaining <= 0

  useEffect(() => {
    if (!figureSlug) {
      return
    }

    const normalizedPlace = placeSlug ?? null
    const alreadyActive =
      sessionReady &&
      activeFigureSlug === figureSlug &&
      (activePlaceSlug ?? null) === normalizedPlace

    if (mode === 'guest-starting' || alreadyActive) {
      return
    }

    startGuestSession(dispatch, figureSlug, normalizedPlace)
  }, [
    dispatch,
    figureSlug,
    placeSlug,
    sessionReady,
    activeFigureSlug,
    activePlaceSlug,
    mode,
  ])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()

    if (!trimmed || !sessionReady || guestLimitExhausted) {
      return
    }

    try {
      setSending(true)
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `user-${Date.now()}`,
          role: 'user',
          content: trimmed,
          created_at: new Date().toISOString(),
        },
      })
      setInputValue('')

      const res = await guestAsk(trimmed, currentThreadId ?? null)
      const answer =
        res?.answer ??
        res?.message ??
        res?.content ??
        (Array.isArray(res?.messages) ? res.messages.map((msg) => msg?.content).filter(Boolean).join('\n\n') : '')

      if (answer) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: answer,
            created_at: new Date().toISOString(),
          },
        })
      }

      const updatedRemaining =
        res?.remaining_questions ?? res?.remainingQuestions ?? normalizedRemaining ?? null
      const updatedMax = res?.max_questions ?? res?.maxQuestions ?? maxQuestions ?? null

      if (updatedRemaining !== null || updatedMax !== null) {
        dispatch({
          type: 'UPDATE_GUEST_LIMITS',
          payload: {
            remainingQuestions: updatedRemaining,
            maxQuestions: updatedMax,
          },
        })
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Something went wrong sending your message. Please try again.',
      })
    } finally {
      setSending(false)
    }
  }

  const disabled = sending || isPreparing || hasError || !sessionReady || guestLimitExhausted
  const displayFigure = activeFigureSlug ?? figureSlug
  const displayPlace = activePlaceSlug ?? placeSlug
  const contextLine = displayFigure ? (
    <>
      You're talking to <strong>{displayFigure}</strong>
      {displayPlace && (
        <>
          {' '}
          about <strong>{displayPlace}</strong>
        </>
      )}
      .
    </>
  ) : (
    <>Select a historical figure from the site to start a conversation.</>
  )

  return (
    <section className="chat-page">
      <p className="eyebrow">Talk to History</p>
      <h1>Places in Time Chat</h1>
      <p className="chat-context">{contextLine}</p>
      {hasError && <p className="chat-error">{error}</p>}
      {isPreparing && figureSlug && <p className="chat-status">Preparing your guest chat session...</p>}
      {typeof normalizedRemaining === 'number' && (
        <p className="chat-limit-note">
          Guest pass: {normalizedRemaining}
          {maxQuestions ? ` of ${maxQuestions}` : ''} questions remaining.
        </p>
      )}
      {sessionReady && maxQuestions ? (
        <p className="chat-allowance">This guest session allows up to {maxQuestions} questions.</p>
      ) : null}
      {guestLimitExhausted && (
        <div className="chat-limit-panel">
          <p>Your guest pass is used up. Log in or register to continue the conversation.</p>
          <div className="chat-limit-actions">
            <a className="button" href={`${CHAT_API_BASE_URL}/login`}>
              Log in
            </a>
            <a className="button" href={`${CHAT_API_BASE_URL}/register`}>
              Sign up
            </a>
            <a className="button" href={`${CHAT_API_BASE_URL}/dashboard`}>
              Go to dashboard
            </a>
          </div>
        </div>
      )}
      <div className="chat-shell">
        <div className="chat-messages">
          {messages.length === 0 && (
            <p className="chat-empty">Ask a question to begin — for example, "What was daily life like here in your time?"</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={msg.id ?? `${msg.role}-${index}`}
              className={`chat-message chat-message-${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="chat-message-meta">
                <span className="chat-message-role">{msg.role === 'user' ? 'You' : 'History Guide'}</span>
              </div>
              <div className="chat-message-content">{msg.content}</div>
            </div>
          ))}
        </div>
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder={
              sessionReady
                ? 'Ask your question...'
                : isPreparing
                ? 'Setting up your guest session...'
                : 'Chat is unavailable right now.'
            }
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={disabled}
          />
          <button type="submit" className="button primary" disabled={disabled}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Chat
