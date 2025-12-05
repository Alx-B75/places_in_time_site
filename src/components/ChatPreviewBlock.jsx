const ChatPreviewBlock = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <div className="chat-preview">
      {messages.map((message) => (
        <div key={message.id} className={`chat-bubble ${message.role}`}>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatPreviewBlock
