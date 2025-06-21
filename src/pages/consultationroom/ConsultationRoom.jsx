"use client";

import { useState, useRef, useEffect, useCallback } from "react"; // Added useCallback
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
  faExpand,
  faCompress,
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

  // Get token & role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage.");
      // Optionally redirect to login if no token
      // navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Token decoding error:", error);
      // Handle invalid token (e.g., clear token, redirect to login)
    }
  }, []); // Runs only once on mount

  // Connect to Socket.IO
  useEffect(() => {
    // Determine the Socket.IO server URL based on the environment
    const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production'
      ? 'https://dwak.onrender.com' // <<<<<<< IMPORTANT: REPLACE WITH YOUR ACTUAL RENDER BACKEND'S PUBLIC URL
      : 'http://localhost:5000'; // For local development

    console.log(`Connecting to Socket.IO at: ${SOCKET_SERVER_URL}`);
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected!", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        // You might want to display a user-friendly message here
    });

    // Cleanup function: Disconnect the socket when the component unmounts
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
      setSocket(null); // Clear the socket state
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Get local media stream
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
          console.log("Local media stream set.");
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Please allow camera and microphone access to join the consultation.");
      }
    };
    getMedia();

    // Cleanup function: Stop local media tracks when component unmounts
    return () => {
      if (localStreamRef.current) {
        console.log("Stopping local media tracks.");
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Runs only once on mount

  // Handle WebRTC connection and Socket.IO signaling
  // This useEffect will run when `socket`, `roomId`, or `localStreamRef.current` becomes available or changes.
  useEffect(() => {
    // Ensure all necessary dependencies are available before proceeding
    if (!socket || !roomId || !localStreamRef.current) {
      console.log("WebRTC useEffect waiting for dependencies...");
      return;
    }

    // Initialize RTCPeerConnection if it doesn't exist or is closed
    let peerConnection = peerConnectionRef.current;
    if (!peerConnection || peerConnection.signalingState === 'closed') {
        console.log("Initializing new RTCPeerConnection...");
        peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = peerConnection; // Store in ref
    } else {
        console.log("Using existing RTCPeerConnection.");
    }


    // Add local tracks to the peer connection if not already added
    localStreamRef.current.getTracks().forEach((track) => {
      // Check if the track is already added to prevent duplicates
      const senders = peerConnection.getSenders();
      const trackAlreadyAdded = senders.some(sender => sender.track === track);
      if (!trackAlreadyAdded) {
        console.log("Adding track to peerConnection:", track.kind);
        peerConnection.addTrack(track, localStreamRef.current);
      }
    });

    const remoteStream = new MediaStream();
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
    }

    peerConnection.ontrack = (event) => {
      console.log("📡 Received remote track", event.streams);
      event.streams[0].getTracks().forEach((track) => {
        // Only add track if it's not already part of the remoteStream
        if (!remoteStream.getTrackById(track.id)) {
          remoteStream.addTrack(track);
          console.log(`Added remote ${track.kind} track.`);
        }
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Peer connection state changed:", peerConnection.connectionState);
      // Useful for debugging: 'new', 'connecting', 'connected', 'disconnected', 'failed', 'closed'
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed:", peerConnection.iceConnectionState);
      // Useful for debugging: 'new', 'checking', 'connected', 'completed', 'failed', 'disconnected', 'closed'
    };

    // Join the room via Socket.IO
    socket.emit("joinRoom", roomId);

    // useCallback for createOffer to avoid re-creation on every render
    const createOffer = async () => {
        if (!peerConnection || peerConnection.signalingState === 'closed') {
            console.error("Cannot create offer: PeerConnection is closed or not initialized.");
            return;
        }
        try {
            console.log("Creating offer...");
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
        } catch (error) {
            console.error("Failed to create offer:", error);
        }
    };

    // Socket.IO signaling event listeners
    const handleRoomUsers = (users) => {
      console.log("👥 Current room users:", users);
      // You can use this to manage UI states (e.g., showing "waiting for peer")
      if (users.length === 1 && users[0] === socket.id) {
        console.log("Waiting for another peer to join...");
      } else if (users.length === 2 && users.includes(socket.id)) {
        console.log("Two users in room. Signaling will proceed.");
      }
    };

    const handleNewPeerReady = (otherSocketId) => {
      console.log(`💡 New peer (${otherSocketId}) is ready. Creating offer...`);
      createOffer(); // The existing peer (initiator) creates the offer
    };

    const handleInitiatorSignal = () => {
      console.log(`Waiting for offer from initiator...`);
      // This peer is the second to join and should wait for an offer.
    };

    const handleOffer = async ({ offer }) => {
      console.log("Received offer:", offer);
      if (!peerConnection || peerConnection.signalingState === 'closed') {
          console.error("Cannot set remote description: PeerConnection is closed.");
          // Re-initialize or handle error appropriately
          return;
      }
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      } catch (error) {
        console.error("Failed to set remote description or create answer:", error);
      }
    };

    const handleAnswer = async ({ answer }) => {
      console.log("Received answer:", answer);
      if (!peerConnection || peerConnection.signalingState === 'closed') {
          console.error("Cannot set remote description: PeerConnection is closed.");
          return;
      }
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Failed to set remote description (answer):", error);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      if (!peerConnection || peerConnection.signalingState === 'closed' || peerConnection.remoteDescription === null) {
          console.warn("Cannot add ICE candidate: PeerConnection is closed or remoteDescription not set.");
          return;
      }
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        // Ignore "Candidate gathering cannot be restarted" if remote description is being set
        if (!err.toString().includes("Candidate gathering cannot be restarted")) {
            console.error("Failed to add ICE candidate:", err);
        }
      }
    };

    const handlePeerDisconnected = (disconnectedSocketId) => {
      console.log(`Peer ${disconnectedSocketId} disconnected. Closing peer connection.`);
      // If a peer disconnects, close the existing peer connection and clear the remote video
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null; // Important: Reset the ref
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      // You might want to re-join the room or display a "peer left" message
    };

    // Attach listeners
    socket.on("roomUsers", handleRoomUsers);
    socket.on("newPeerReady", handleNewPeerReady);
    socket.on("initiatorSignal", handleInitiatorSignal);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("peerDisconnected", handlePeerDisconnected);

    // Cleanup function: Remove WebRTC-related listeners and close peer connection
    return () => {
      console.log("Cleaning up WebRTC useEffect...");
      socket.off("roomUsers", handleRoomUsers);
      socket.off("newPeerReady", handleNewPeerReady);
      socket.off("initiatorSignal", handleInitiatorSignal);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("peerDisconnected", handlePeerDisconnected);

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socket, roomId, localStreamRef.current]); // Dependencies for this useEffect

  // Handle incoming messages (separate useEffect for clarity and distinct dependencies)
  useEffect(() => {
    if (!socket) return; // Only run if socket is available

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]); // Dependency on socket only

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicActive(audioTrack.enabled);
      console.log("Mic toggled:", audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraActive(videoTrack.enabled);
      console.log("Camera toggled:", videoTrack.enabled);
    }
  };

  const endCall = () => {
    console.log("Ending call...");
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    // Stop local media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    // Disconnect socket (if not handled by parent component unmount)
    if (socket) {
        socket.disconnect();
        setSocket(null);
    }
    alert("Appel terminé");
    // Optionally redirect after call ends
    // window.location.href = '/some-other-page'; // Or use navigate from react-router-dom
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
    if (!token) {
      console.error("Cannot send message: No token found.");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      console.error("Invalid token when sending message.");
      return;
    }

    const message = {
      id: Date.now(),
      sender: decoded.role === "doctor" ? "Docteur" : "Patient",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", { roomId, message });
    setMessages((prev) => [...prev, message]); // Optimistic update
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
      // Only drag if clicking on the overlay itself, not children like video or controls
      if (e.target !== localVideoElement) return; // Changed from tagName/closest for more precise drag area

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

  if (userRole === null) return <div>Chargement...</div>; // Show loading until role is determined

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
              muted={true} // Always mute your own audio (prevents echo)
              className="video-element"
            />
            <div className="local-video-label">Vous</div>
          </div>

          {/* Call Controls */}
          <div className="call-controls">
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
                  key={index} // Consider using message.id if unique, otherwise index is fine as last resort
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
