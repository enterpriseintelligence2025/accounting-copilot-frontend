import { cn } from "../../lib/utils"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, XCircle, Loader2 } from "lucide-react"

const UserInputs = ({ message: messages, setMessages }) => {
  const [inputValue, setInputValue] = useState("")
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async () => {
    if (!inputValue.trim() || uploading) return

    setUploading(true)

    // 1️⃣ Add user message
    const userMessage = { role: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])

    // 2️⃣ Create placeholder assistant message
    const assistantMessage = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [...messages, userMessage]
          })
        }
      )

      if (!response.ok || !response.body) {
        throw new Error("Streaming failed")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        const chunk = decoder.decode(value || new Uint8Array())

        if (chunk) {
          setMessages((prev) => {
            const updated = [...prev]
            const lastIndex = updated.length - 1
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: updated[lastIndex].content + chunk
            }
            return updated
          })
        }
      }
    } catch (error) {
      console.error("Chat stream error:", error)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong while streaming the response."
        }
      ])
    }

    setInputValue("")
    setFiles([])
    setUploading(false)
  }

  /* ---------- File Handling (unchanged) ---------- */

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (files.length + selectedFiles.length <= 10) {
      setFiles((prev) => [...prev, ...selectedFiles])
    } else {
      alert("You can upload a maximum of 10 files.")
    }
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* File Preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button onClick={() => handleRemoveFile(index)}>
                <XCircle className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center space-x-3 border p-2 rounded-lg shadow-md">
        <label htmlFor="file-upload" className="cursor-pointer">
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>

        <textarea
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && handleSubmit()
          }
          className={cn(
            "flex-1 h-20 resize-none rounded-md border p-2",
            uploading && "text-gray-400 cursor-not-allowed bg-gray-100"
          )}
          disabled={uploading}
        />

        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-black hover:bg-gray-800"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default UserInputs
