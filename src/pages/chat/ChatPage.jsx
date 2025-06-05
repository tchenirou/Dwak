"use client"

import React, { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import ConversationList from "../conversationlist/ConversationList"
import ChatWindow from "../ChatWindow/ChatWindow"
import "./ChatPage.css"

const ChatPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()
  const isConversationSelected = window.location.pathname.includes("/chat/")

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="chat-page">
      {/* On mobile, show either the conversation list or the chat window */}
      {isMobile ? (
        isConversationSelected ? (
          <Routes>
            <Route path="/:id" element={<ChatWindow />} />
          </Routes>
        ) : (
          <ConversationList />
        )
      ) : (
        // On desktop, show both the conversation list and the chat window
        <div className="chat-layout">
          <div className="sidebar">
            <ConversationList />
          </div>
          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="no-conversation-selected">
                    <div className="no-conversation-content">
                      <i className="fas fa-comments"></i>
                      <h2>Sélectionnez une conversation</h2>
                      <p>Choisissez une conversation existante ou démarrez une nouvelle discussion.</p>
                    </div>
                  </div>
                }
              />
              <Route path="/:id" element={<ChatWindow />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage
