/*
  chatInterface.jsx
  - Hosts the chat UI: conversation history + user inputs.
  - Persists messages to `localStorage` so conversations survive reloads.
*/
import { useState, useEffect } from "react"
import ConversationWindow from "./chatInterfaceComponents/ConversationWindow"
// import UserInputs from "./chatInterfaceComponents/userInputs"
import UserInputs from "./chatInterfaceComponents/UserInputs"

export default function ChatInterface() {
  // Initialize messages from localStorage to persist conversation state
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    return storedMessages ? JSON.parse(storedMessages) : []
  })

  // Persist messages whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])
  
  // Placeholder effect kept intentionally for future side-effects
  useEffect(() => {
  }, [messages, setMessages])

  return (
    <div className="flex flex-col min-h-[78vh] h-auto">
      <div className="flex-1 h-full overflow-y-auto mb-1 space-top-4">
        <ConversationWindow messages={messages} setMessages={setMessages} />
      </div>
      <div className="flex-shrink-0">
        {/* `UserInputs` handles sending new messages and optional file uploads */}
        <UserInputs message={messages} setMessages={setMessages} />
      </div>
    </div>
  )
}
