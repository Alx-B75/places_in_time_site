const ChatPreviewBlock = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <div className="chat-preview" aria-label="Chat preview transcript">
      {messages.map((message) => (
        <div key={message.id} className={`chat-bubble ${message.role}`}>
          <p>{message.text ?? '/* TODO: add chat text */'}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatPreviewBlock
