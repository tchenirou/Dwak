"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ConsultationRoom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faPhoneSlash,
  faPaperPlane,
  faExpand, // New icon for expand/contract
  faCompress, // New icon for expand/contract
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const ConsultationRoom = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null); // This will now point to YOUR video feed
  const remoteVideoRef = useRef(null); // This will now point to THE OTHER PERSON's video feed
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const localVideoOverlayRef = useRef(null); // Ref for the local video overlay div

  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isLocalVideoExpanded, setIsLocalVideoExpanded] = useState(false); // State for local video size

  // Get token & role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }, []);

  // Connect to socket
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Socket connected!", newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Get local media
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    getMedia();
  }, []);

  // Handle WebRTC connection
  useEffect(() => {
    if (!socket || !roomId || !localStreamRef.current) return;

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = peerConnection;

    localStreamRef.current.getTracks().forEach((track) => {
      console.log("Adding track to peerConnection:", track.kind);
      peerConnection.addTrack(track, localStreamRef.current);
    });

    const remoteStream = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    peerConnection.ontrack = (event) => {
      console.log("📡 Received remote track", event.streams);
      // Ensure we only add tracks if they are not already part of the remoteStream
      event.streams[0].getTracks().forEach((track) => {
        if (!remoteStream.getTrackById(track.id)) {
          // Prevent duplicate tracks
          remoteStream.addTrack(track);
        }
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      console.log("Peer connection state changed:", peerConnection.connectionState);
      // Useful for debugging: 'new', 'connecting', 'connected', 'disconnected', 'failed', 'closed'
    };

    peerConnection.oniceconnectionstatechange = (event) => {
      console.log("ICE connection state changed:", peerConnection.iceConnectionState);
      // Useful for debugging: 'new', 'checking', 'connected', 'completed', 'failed', 'disconnected', 'closed'
    };

    socket.emit("joinRoom", roomId);

    const createOffer = async () => {
      console.log("Creating offer...");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    };

    // New logic to handle peer joining/leaving
    socket.on("roomUsers", (users) => {
      console.log("👥 Current room users:", users);
      if (users.length === 1 && users[0] === socket.id) {
        // This is the first user, wait for another to join
        console.log("Waiting for another peer to join...");
      } else if (users.length === 2 && users.includes(socket.id)) {
        // Two users, but handle initiation based on who joined first (or explicitly signaled)
        // This event is mainly for awareness, the offer creation logic will be driven by 'newPeerReady'
        console.log("Two users in room. Signaling will proceed.");
      }
    });

    // When the first peer is notified that a second peer is ready
    socket.on("newPeerReady", (otherSocketId) => {
      console.log(`💡 New peer (${otherSocketId}) is ready. Creating offer...`);
      createOffer(); // The existing peer (initiator) creates the offer
    });

    // When the second peer joins and needs to wait for the offer
    socket.on("initiatorSignal", () => {
      console.log(`Waiting for offer from initiator...`);
      // No action needed here, it just signals that this peer is not the initiator
    });

    socket.on("offer", async ({ offer }) => {
      console.log("Received offer:", offer);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Received answer:", answer);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Failed to add ICE candidate:", err);
      }
    });

    socket.on("peerDisconnected", (disconnectedSocketId) => {
      console.log(`Peer ${disconnectedSocketId} disconnected. Closing peer connection.`);
      peerConnection.close();
      // You might want to clear the remote video here, or show a message
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      // Potentially reset peerConnectionRef.current or set up for a new connection if needed
      peerConnectionRef.current = null; // Important to reset
    });

    return () => {
      console.log("Cleaning up WebRTC useEffect...");
      socket.off("roomUsers");
      socket.off("newPeerReady");
      socket.off("initiatorSignal");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("peerDisconnected"); // Clean up new listener

      // Ensure peerConnection is closed and resources are released
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socket, roomId, localStreamRef.current]); // Keep localStreamRef.current as dependency

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, roomId]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicActive(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraActive(videoTrack.enabled);
    }
  };

  const endCall = () => {
    alert("Appel terminé");
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    // Optionally redirect after call ends
    // window.location.href = '/some-other-page';
  };

  const leaveRoom = () => {
    if (window.confirm("Êtes-vous sûr de vouloir quitter la consultation ?")) {
      endCall(); // Ensure call resources are cleaned up
      window.history.back(); // Navigate back
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      console.error("Invalid token");
      return;
    }

    const message = {
      id: Date.now(),
      sender: decoded.role === "doctor" ? "Docteur" : "Patient",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", { roomId, message });
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Drag functionality for local video overlay
  useEffect(() => {
    const localVideoElement = localVideoOverlayRef.current;
    if (!localVideoElement) return;

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      // Only drag if not clicking on the video element itself or controls
      if (e.target.tagName === 'VIDEO' || e.target.closest('.video-controls')) return;

      isDragging = true;
      const rect = localVideoElement.getBoundingClientRect();
      offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      localVideoElement.style.cursor = 'grabbing';
      e.preventDefault(); // Prevent default browser drag behavior
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const videoSection = localVideoElement.parentElement;
      if (!videoSection) return;

      const videoSectionRect = videoSection.getBoundingClientRect();

      let newLeft = e.clientX - offset.x - videoSectionRect.left;
      let newTop = e.clientY - offset.y - videoSectionRect.top;

      // Keep within bounds
      newLeft = Math.max(0, Math.min(newLeft, videoSectionRect.width - localVideoElement.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, videoSectionRect.height - localVideoElement.offsetHeight));

      localVideoElement.style.left = `${newLeft}px`;
      localVideoElement.style.top = `${newTop}px`;
      localVideoElement.style.right = 'auto'; // Disable right/bottom positioning when dragging by left/top
      localVideoElement.style.bottom = 'auto';
    };

    const onMouseUp = () => {
      isDragging = false;
      localVideoElement.style.cursor = 'grab';
    };

    localVideoElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      localVideoElement.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []); // Only runs once on mount

  if (!userRole) return <div>Chargement...</div>;

  return (
    <div className="consultation-room">
      <div className="room-header">
        <div className="header-left">
          <h1>Consultation - Salle {roomId}</h1>
          <p className="room-status">En cours</p>
        </div>
        <button className="leave-button" onClick={leaveRoom}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Quitter
        </button>
      </div>

      {/* Main content area: Video on left, Chat on right */}
      <div className="main-content-area">
        {/* Video Section */}
        <div className="video-section">
          {/* Remote User Video (Main display) */}
          <div className="main-video-wrapper">
            <video
              ref={remoteVideoRef} // Remote user's video
              autoPlay
              playsInline
              muted={false} // Always unmute the remote participant's audio
              className="video-element"
            />
            <div className="main-video-label">
              {userRole === "doctor" ? "Patient" : "Docteur"}
            </div>
          </div>

          {/* Local User Video (Small overlay) */}
          <div
            ref={localVideoOverlayRef}
            className={`local-video-overlay ${isLocalVideoExpanded ? "expanded" : ""}`}
            // Inline style for initial positioning, can be overridden by drag JS
            style={{ bottom: '20px', right: '20px' }}
          >
            <video
              ref={localVideoRef} // Your own video
              autoPlay
              playsInline
              muted={true} // Always mute your own audio
              className="video-element"
            />
            <div className="local-video-label">Vous</div>
          </div>

          {/* Call Controls */}
          <div className="call-controls"> {/* Renamed for clarity */}
            <button
              onClick={toggleMic}
              className={`control-button ${isMicActive ? "active" : "inactive"}`}
            >
              <FontAwesomeIcon
                icon={isMicActive ? faMicrophone : faMicrophoneSlash}
              />
            </button>
            <button
              onClick={toggleCamera}
              className={`control-button ${isCameraActive ? "active" : "inactive"}`}
            >
              <FontAwesomeIcon
                icon={isCameraActive ? faVideo : faVideoSlash}
              />
            </button>
            <button
              onClick={() => setIsLocalVideoExpanded(!isLocalVideoExpanded)}
              className="control-button"
              title={isLocalVideoExpanded ? "Shrink your video" : "Expand your video"}
            >
              <FontAwesomeIcon icon={isLocalVideoExpanded ? faCompress : faExpand} />
            </button>
            <button onClick={endCall} className="control-button end-call">
              <FontAwesomeIcon icon={faPhoneSlash} />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          <div className="chat-header">
            <h2>Messages</h2>
          </div>
          <div className="messages-container" ref={chatContainerRef}>
            {messages.map((message, index) => {
              const isSentByUser =
                (userRole === "doctor" && message.sender === "Docteur") ||
                (userRole === "patient" && message.sender === "Patient");

              return (
                <div
                  key={index}
                  className={`message ${isSentByUser ? "sent" : "received"}`}
                >
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-content">
                    <p>{message.content}</p>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
            />
            <button type="submit" className="send-button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
