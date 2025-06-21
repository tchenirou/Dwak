"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const localVideoOverlayRef = useRef(null);

  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isLocalVideoExpanded, setIsLocalVideoExpanded] = useState(false);

  // --- NEW: State for queuing ICE candidates ---
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState([]);
  // --- NEW: Ref to track if remote description is set ---
  const remoteDescriptionSetRef = useRef(false);

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
      ? '[https://dwak.onrender.com](https://dwak.onrender.com)' // IMPORTANT: This URL MUST be your actual Render backend's public URL
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
        remoteDescriptionSetRef.current = false; // Reset remote description status for new PC
    } else {
        console.log("Using existing RTCPeerConnection.");
    }

    // Add local tracks to the peer connection if not already added
    localStreamRef.current.getTracks().forEach((track) => {
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
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed:", peerConnection.iceConnectionState);
    };

    socket.emit("joinRoom", roomId);

    // useCallback for createOffer to avoid re-creation on every render
    const createOffer = useCallback(async () => {
        const currentPc = peerConnectionRef.current; // Use current ref value
        if (!currentPc || currentPc.signalingState === 'closed') {
            console.error("Cannot create offer: PeerConnection is closed or not initialized.");
            return;
        }
        try {
            console.log("Creating offer...");
            const offer = await currentPc.createOffer();
            await currentPc.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
        } catch (error) {
            console.error("Failed to create offer:", error);
        }
    }, [socket, roomId]); // Dependencies for createOffer

    // Socket.IO signaling event listeners (using useCallback for stability)
    const handleRoomUsers = useCallback((users) => {
      console.log("👥 Current room users:", users);
      if (users.length === 1 && users[0] === socket.id) {
        console.log("Waiting for another peer to join...");
      } else if (users.length === 2 && users.includes(socket.id)) {
        console.log("Two users in room. Signaling will proceed.");
      }
    }, [socket]); // Dependency on socket

    const handleNewPeerReady = useCallback((otherSocketId) => {
      console.log(`💡 New peer (${otherSocketId}) is ready. Creating offer...`);
      createOffer(); // The existing peer (initiator) creates the offer
    }, [createOffer]); // Dependency on createOffer

    const handleInitiatorSignal = useCallback(() => {
      console.log(`Waiting for offer from initiator...`);
    }, []); // No dependencies

    const handleOffer = useCallback(async ({ offer }) => {
      console.log("Received offer:", offer);
      const currentPc = peerConnectionRef.current;
      if (!currentPc || currentPc.signalingState === 'closed') {
          console.error("Cannot set remote description: PeerConnection is closed.");
          return;
      }
      try {
        await currentPc.setRemoteDescription(new RTCSessionDescription(offer));
        remoteDescriptionSetRef.current = true; // Mark remote description as set

        // Process any queued ICE candidates after setting remote description
        iceCandidatesQueue.forEach(candidate => {
            currentPc.addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error("Error adding queued ICE candidate:", e));
        });
        setIceCandidatesQueue([]); // Clear the queue

        const answer = await currentPc.createAnswer();
        await currentPc.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      } catch (error) {
        console.error("Failed to set remote description or create answer:", error);
      }
    }, [socket, roomId, iceCandidatesQueue]); // Dependencies

    const handleAnswer = useCallback(async ({ answer }) => {
      console.log("Received answer:", answer);
      const currentPc = peerConnectionRef.current;
      if (!currentPc || currentPc.signalingState === 'closed') {
          console.error("Cannot set remote description: PeerConnection is closed.");
          return;
      }
      try {
        await currentPc.setRemoteDescription(new RTCSessionDescription(answer));
        remoteDescriptionSetRef.current = true; // Mark remote description as set

        // Process any queued ICE candidates after setting remote description
        iceCandidatesQueue.forEach(candidate => {
            currentPc.addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error("Error adding queued ICE candidate:", e));
        });
        setIceCandidatesQueue([]); // Clear the queue

      } catch (error) {
        console.error("Failed to set remote description (answer):", error);
      }
    }, [iceCandidatesQueue]); // Dependencies

    const handleIceCandidate = useCallback(async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      const currentPc = peerConnectionRef.current;
      if (!currentPc || currentPc.signalingState === 'closed') {
          console.warn("Cannot add ICE candidate: PeerConnection is closed.");
          return;
      }

      if (remoteDescriptionSetRef.current && currentPc.remoteDescription !== null) {
          // Remote description is already set, add candidate directly
          try {
              await currentPc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
              // Ignore "Candidate gathering cannot be restarted" if remote description is being set
              if (!err.toString().includes("Candidate gathering cannot be restarted")) {
                  console.error("Failed to add ICE candidate:", err);
              }
          }
      } else {
          // Remote description not yet set, queue the candidate
          console.log("Queuing ICE candidate, remoteDescription not yet set.");
          setIceCandidatesQueue(prev => [...prev, candidate]);
      }
    }, []); // No dependencies for handleIceCandidate as it uses refs/setters

    const handlePeerDisconnected = useCallback((disconnectedSocketId) => {
      console.log(`Peer ${disconnectedSocketId} disconnected. Closing peer connection.`);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null; // Important: Reset the ref
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }, []); // No dependencies

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
  }, [socket, roomId, localStreamRef.current, iceCandidatesQueue]); // Dependencies for this useEffect

  // Handle incoming messages (separate useEffect for clarity and distinct dependencies)
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

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
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (socket) {
        socket.disconnect();
        setSocket(null);
    }
    alert("Appel terminé");
  };

  const leaveRoom = () => {
    if (window.confirm("Êtes-vous sûr de vouloir quitter la consultation ?")) {
      endCall();
      window.history.back();
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
      // Only drag if clicking on the overlay itself, not children like video or controls
      if (e.target !== localVideoElement) return;

      isDragging = true;
      const rect = localVideoElement.getBoundingClientRect();
      offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      localVideoElement.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const videoSection = localVideoElement.parentElement;
      if (!videoSection) return;

      const videoSectionRect = videoSection.getBoundingClientRect();

      let newLeft = e.clientX - offset.x - videoSectionRect.left;
      let newTop = e.clientY - offset.y - videoSectionRect.top;

      newLeft = Math.max(0, Math.min(newLeft, videoSectionRect.width - localVideoElement.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, videoSectionRect.height - localVideoElement.offsetHeight));

      localVideoElement.style.left = `${newLeft}px`;
      localVideoElement.style.top = `${newTop}px`;
      localVideoElement.style.right = 'auto';
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
  }, []);

  if (userRole === null) return <div>Chargement...</div>;

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

      <div className="main-content-area">
        <div className="video-section">
          <div className="main-video-wrapper">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              className="video-element"
            />
            <div className="main-video-label">
              {userRole === "doctor" ? "Patient" : "Docteur"}
            </div>
          </div>

          <div
            ref={localVideoOverlayRef}
            className={`local-video-overlay ${isLocalVideoExpanded ? "expanded" : ""}`}
            style={{ bottom: '20px', right: '20px' }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true}
              className="video-element"
            />
            <div className="local-video-label">Vous</div>
          </div>

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
                  key={message.id || index}
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
