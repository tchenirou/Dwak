"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./ConversationList.css"

const ConversationList = () => {
  const [conversations, setConversations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user._id) || conversation.participants[0]
  }

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return "Aucun message"

    if (conversation.lastMessage.contentType === "text") {
      return conversation.lastMessage.content.length > 30
        ? `${conversation.lastMessage.content.substring(0, 30)}...`
        : conversation.lastMessage.content
    } else if (conversation.lastMessage.contentType === "image") {
      return "📷 Image"
    } else if (conversation.lastMessage.contentType === "file") {
      return "📎 Fichier"
    } else if (conversation.lastMessage.contentType === "video-call") {
      return "📹 Appel vidéo"
    } else if (conversation.lastMessage.contentType === "audio-call") {
      return "📞 Appel audio"
    }

    return "Message"
  }

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      })
    }
  }

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = getOtherParticipant(conversation)
    const fullName = `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const handleConversationClick = (conversationId) => {
    navigate(`/chat/${conversationId}`)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="conversation-list-container">
        <div className="conversation-list-header">
          <h2>Messages</h2>
        </div>
        <div className="search-container">
          <div className="search-icon">
            <i className="fas fa-search"></i>
          </div>
          <input className="search-input" placeholder="Rechercher une conversation..." disabled />
        </div>
        <div className="conversations-container">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="conversation-item-loading">
              <div className="avatar-loading"></div>
              <div className="conversation-details-loading">
                <div className="name-loading"></div>
                <div className="preview-loading"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="conversation-list-container">
      <div className="conversation-list-header">
        <h2>Messages</h2>
        <button className="new-message-button">
          <i className="fas fa-comment"></i>
        </button>
      </div>
      <div className="search-container">
        <div className="search-icon">
          <i className="fas fa-search"></i>
        </div>
        <input
          className="search-input"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="conversations-container">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">Aucune conversation trouvée</div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation)
            const unreadCount = conversation.unreadCount[user._id] || 0

            return (
              <div
                key={conversation._id}
                className={`conversation-item ${unreadCount > 0 ? "unread" : ""}`}
                onClick={() => handleConversationClick(conversation._id)}
              >
                <div className="avatar">
                  {otherParticipant.profileImage ? (
                    <img
                      src={otherParticipant.profileImage || "/placeholder.svg"}
                      alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                    />
                  ) : (
                    <div className="avatar-initials">
                      {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
                    </div>
                  )}
                </div>
                <div className="conversation-details">
                  <div className="conversation-header">
                    <h3 className="participant-name">
                      {otherParticipant.firstName} {otherParticipant.lastName}
                    </h3>
                    <span className="timestamp">
                      {conversation.lastMessage && getFormattedDate(conversation.updatedAt)}
                    </span>
                  </div>
                  <div className="conversation-footer">
                    <p className={`message-preview ${unreadCount > 0 ? "unread" : ""}`}>
                      {getLastMessagePreview(conversation)}
                    </p>
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ConversationList
