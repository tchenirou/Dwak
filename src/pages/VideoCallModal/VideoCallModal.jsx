"use client"

import { useState, useEffect, useRef } from "react"
import "./VideoCallModal.css"

const VideoCallModal = ({ isOpen, onClose, participant, conversationId, socket }) => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isCallConnected, setIsCallConnected] = useState(false)
  const [isCallInitiator, setIsCallInitiator] = useState(false)
  const [callStatus, setCallStatus] = useState("connecting")

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)

  // Initialize WebRTC
  useEffect(() => {
    if (!isOpen) return

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        setLocalStream(stream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Initialize peer connection
        const configuration = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
        }

        const peerConnection = new RTCPeerConnection(configuration)
        peerConnectionRef.current = peerConnection

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream)
        })

        // Handle remote tracks
        peerConnection.ontrack = (event) => {
          setRemoteStream(event.streams[0])

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }

          setIsCallConnected(true)
          setCallStatus("connected")
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.emit("webrtc-signal", {
              recipientId: participant._id,
              signal: {
                type: "ice-candidate",
                candidate: event.candidate,
              },
            })
          }
        }

        // Check if we're the call initiator
        const urlParams = new URLSearchParams(window.location.search)
        const isInitiator = urlParams.get("initiateCall") === "true"

        if (isInitiator) {
          setIsCallInitiator(true)
          setCallStatus("ringing")

          // Create and send offer
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)

          if (socket) {
            socket.emit("webrtc-signal", {
              recipientId: participant._id,
              signal: {
                type: "offer",
                sdp: offer,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initializeMedia()

    return () => {
      // Clean up
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }

      if (socket) {
        socket.emit("end-call", {
          recipientId: participant._id,
        })
      }
    }
  }, [isOpen, participant._id, socket])

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket || !peerConnectionRef.current) return

    const handleSignal = async (data) => {
      const { callerId, signal } = data

      // Only process signals from the participant we're calling
      if (callerId !== participant._id) return

      if (signal.type === "offer") {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        const answer = await peerConnectionRef.current.createAnswer()
        await peerConnectionRef.current.setLocalDescription(answer)

        socket.emit("webrtc-signal", {
          recipientId: participant._id,
          signal: {
            type: "answer",
            sdp: answer,
          },
        })

        setCallStatus("connected")
      } else if (signal.type === "answer") {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        setCallStatus("connected")
      } else if (signal.type === "ice-candidate") {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate))
      }
    }

    const handleCallEnded = (data) => {
      if (data.callerId === participant._id) {
        setCallStatus("ended")
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    }

    socket.on("webrtc-signal", handleSignal)
    socket.on("call-ended", handleCallEnded)

    return () => {
      socket.off("webrtc-signal", handleSignal)
      socket.off("call-ended", handleCallEnded)
    }
  }, [socket, participant._id, onClose])

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioMuted(!isAudioMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    if (socket) {
      socket.emit("end-call", {
        recipientId: participant._id,
      })
    }

    setCallStatus("ended")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (!isOpen) return null

  return (
    <div className="video-call-modal">
      {/* Call status bar */}
      <div className="call-status-bar">
        <div className="participant-info">
          <div className="avatar">
            {participant.profileImage ? (
              <img
                src={participant.profileImage || "/placeholder.svg"}
                alt={`${participant.firstName} ${participant.lastName}`}
              />
            ) : (
              <div className="avatar-initials">{getInitials(participant.firstName, participant.lastName)}</div>
            )}
          </div>
          <div className="participant-details">
            <h3>
              {participant.firstName} {participant.lastName}
            </h3>
            <p>
              {callStatus === "connecting" && "Connexion en cours..."}
              {callStatus === "ringing" && "Appel en cours..."}
              {callStatus === "connected" && "Appel en cours"}
              {callStatus === "ended" && "Appel terminé"}
            </p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Video container */}
      <div className="video-container">
        {/* Remote video (full screen) */}
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
        ) : (
          <div className="remote-placeholder">
            <div className="avatar large">
              {participant.profileImage ? (
                <img
                  src={participant.profileImage || "/placeholder.svg"}
                  alt={`${participant.firstName} ${participant.lastName}`}
                />
              ) : (
                <div className="avatar-initials">{getInitials(participant.firstName, participant.lastName)}</div>
              )}
            </div>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <div className="local-video-container">
          <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
          {isVideoOff && (
            <div className="video-off-overlay">
              <div className="avatar">
                <div className="avatar-initials">{getInitials("Me", "")}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call controls */}
      <div className="call-controls">
        <button className={`control-button ${isAudioMuted ? "active" : ""}`} onClick={toggleAudio}>
          <i className={`fas ${isAudioMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
        </button>
        <button className={`control-button ${isVideoOff ? "active" : ""}`} onClick={toggleVideo}>
          <i className={`fas ${isVideoOff ? "fa-video-slash" : "fa-video"}`}></i>
        </button>
        <button className="control-button end-call" onClick={endCall}>
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>
    </div>
  )
}

export default VideoCallModal
