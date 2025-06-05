"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ChatWindow.css"
import VideoCallModal from "../VideoCallModal/VideoCallModal"
import io from "socket.io-client" // Import socket.io-client

const ChatWindow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const socket = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [otherParticipant, setOtherParticipant] = useState(null)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  // Connect to socket
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    // Initialize socket connection
    const socketInstance = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        token,
      },
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsSocketConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsSocketConnected(false)
    })

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error)
    })

    socket.current = socketInstance

    return () => {
      socketInstance.disconnect()
    }
  }, [navigate])

  // Fetch conversation details and messages
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        // Fetch conversation details
        const conversationResponse = await fetch(`http://localhost:5000/api/conversations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const conversationData = await conversationResponse.json()

        // Set other participant
        const other = conversationData.participants.find((p) => p._id !== user._id)
        setOtherParticipant(other)

        // Fetch messages
        const messagesResponse = await fetch(`http://localhost:5000/api/conversations/${id}/messages?page=1&limit=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const messagesData = await messagesResponse.json()

        setMessages(messagesData.messages)
        setHasMore(messagesData.currentPage < messagesData.totalPages)
        setPage(1)

        // Mark messages as read
        await fetch(`http://localhost:5000/api/conversations/${id}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Error fetching conversation:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchConversation()
    }
  }, [id, user._id])

  // Socket.io event listeners
  useEffect(() => {
    if (!socket.current || !id || !isSocketConnected) return

    // Join conversation room
    socket.current.emit("join-conversation", id)

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message])

      // Mark message as read if we're in the conversation
      if (message.sender._id !== user._id) {
        socket.current.emit("mark-as-read", { messageId: message._id })
      }
    }

    // Listen for incoming calls
    const handleIncomingCall = (data) => {
      if (data.conversationId === id) {
        setShowVideoCall(true)
      }
    }

    socket.current.on("new-message", handleNewMessage)
    socket.current.on("incoming-call", handleIncomingCall)

    return () => {
      socket.current.off("new-message", handleNewMessage)
      socket.current.off("incoming-call", handleIncomingCall)
      socket.current.emit("leave-conversation", id)
    }
  }, [socket.current, id, user._id, isSocketConnected])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Load more messages when scrolling to top
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (container && hasMore && container.scrollTop === 0) {
      loadMoreMessages()
    }
  }

  const loadMoreMessages = async () => {
    if (!hasMore || isLoading) return

    try {
      const token = localStorage.getItem("token")
      const nextPage = page + 1
      const response = await fetch(`http://localhost:5000/api/conversations/${id}/messages?page=${nextPage}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.messages.length > 0) {
        // Preserve scroll position when adding messages to the top
        const container = messagesContainerRef.current
        const scrollHeight = container?.scrollHeight || 0

        setMessages((prev) => [...data.messages, ...prev])
        setPage(nextPage)
        setHasMore(data.currentPage < data.totalPages)

        // Restore scroll position
        if (container) {
          const newScrollHeight = container.scrollHeight
          container.scrollTop = newScrollHeight - scrollHeight
        }
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more messages:", error)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket.current || !id) return

    socket.current.emit("send-message", {
      conversationId: id,
      content: inputMessage.trim(),
      contentType: "text",
    })

    setInputMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const initiateVideoCall = () => {
    if (!socket.current || !otherParticipant) return

    socket.current.emit("video-call-request", {
      conversationId: id,
      recipientId: otherParticipant._id,
    })

    setShowVideoCall(true)
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Group messages by date
  const groupedMessages = {}
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  if (isLoading) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-loading">
            <div className="avatar-loading"></div>
            <div className="header-info-loading">
              <div className="name-loading"></div>
              <div className="status-loading"></div>
            </div>
          </div>
        </div>
        <div className="messages-container">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className={`message-loading ${index % 2 === 0 ? "message-left" : "message-right"}`}>
              <div className="message-content-loading"></div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <div className="chat-input-loading"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-window">
      {/* Chat header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="back-button" onClick={() => navigate("/chat")}>
            <i className="fas fa-arrow-left"></i>
          </button>
          {otherParticipant && (
            <>
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
              <div className="header-info">
                <h3>
                  {otherParticipant.firstName} {otherParticipant.lastName}
                </h3>
                <p>{otherParticipant.role === "doctor" ? "Médecin" : "Patient"}</p>
              </div>
            </>
          )}
        </div>
        <div className="chat-header-actions">
          <button className="action-button" onClick={initiateVideoCall}>
            <i className="fas fa-video"></i>
          </button>
          <button className="action-button">
            <i className="fas fa-phone"></i>
          </button>
          <button className="action-button">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="date-separator">
              <span>{formatMessageDate(date)}</span>
            </div>
            {groupedMessages[date].map((message) => (
              <div
                key={message._id}
                className={`message ${message.sender._id === user._id ? "message-right" : "message-left"}`}
              >
                {message.sender._id !== user._id && (
                  <div className="avatar">
                    {message.sender.profileImage ? (
                      <img
                        src={message.sender.profileImage || "/placeholder.svg"}
                        alt={`${message.sender.firstName} ${message.sender.lastName}`}
                      />
                    ) : (
                      <div className="avatar-initials">
                        {getInitials(message.sender.firstName, message.sender.lastName)}
                      </div>
                    )}
                  </div>
                )}
                <div className="message-content-wrapper">
                  <div className={`message-content ${message.sender._id === user._id ? "sent" : "received"}`}>
                    {message.contentType === "text" ? (
                      <p>{message.content}</p>
                    ) : message.contentType === "image" ? (
                      <img
                        src={message.fileUrl || "/placeholder.svg"}
                        alt="Image"
                        className="message-image"
                        onClick={() => window.open(message.fileUrl, "_blank")}
                      />
                    ) : message.contentType === "file" ? (
                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                        <i className="fas fa-paperclip"></i>
                        {message.fileName}
                      </a>
                    ) : message.contentType === "video-call" ? (
                      <div className="call-message">
                        <i className="fas fa-video"></i>
                        {message.content}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <div className="message-time">{formatMessageTime(message.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="chat-input-container">
        <button className="attachment-button">
          <i className="fas fa-paperclip"></i>
        </button>
        <textarea
          placeholder="Écrivez votre message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="chat-input"
        />
        <button className="send-button" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>

      {/* Video call modal */}
      {showVideoCall && otherParticipant && (
        <VideoCallModal
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
          participant={otherParticipant}
          conversationId={id}
          socket={socket.current}
        />
      )}
    </div>
  )
}

export default ChatWindow
