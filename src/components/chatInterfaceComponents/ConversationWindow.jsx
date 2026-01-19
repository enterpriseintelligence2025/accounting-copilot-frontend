/*
  ConversationWindow.jsx
  - Renders the list of chat messages using `react-markdown`.
  - Supports GitHub-flavored markdown and KaTeX for math rendering.
  - Auto-scrolls to the latest message using a ref.
*/
/*
  ConversationWindow.jsx
  - Renders the chat message list.
  - Uses `react-markdown` with math and GitHub-flavored markdown support so assistant
    responses can include rich content (tables, code blocks, math).
  - Automatically scrolls to the newest message via `messagesEndRef`.
*/
import React, { useEffect, useRef } from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent } from "@/components/ui/card"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

const ConversationWindow = ({ messages, setMessages }) => {
  // Reference to the bottom of the message list for auto-scrolling
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Smooth-scroll to the latest message when `messages` updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      {messages?.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex my-3",
            // Align user messages to the right, assistant to the left
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <Card
            className={cn(
              "max-w-[80%] overflow-x-auto",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <CardContent className="px-4 py-2 text-sm leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Paragraph spacing
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),

                  // Code blocks: inline vs block styling
                  code: ({ inline, className, children }) => {
                    if (inline) {
                      return (
                        <code className="bg-black/10 px-1 py-0.5 rounded text-xs">
                          {children}
                        </code>
                      )
                    }
                    return (
                      <pre className="bg-black text-white p-3 rounded-md overflow-x-auto text-xs my-2">
                        <code>{children}</code>
                      </pre>
                    )
                  },

                  // Tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="w-full border-collapse text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border px-2 py-1 bg-muted font-medium text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border px-2 py-1">{children}</td>
                  ),

                  // Lists
                  li: ({ children }) => (
                    <li className="ml-4 list-disc">{children}</li>
                  ),
                }}
              >
                {message.content || ""}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ConversationWindow
