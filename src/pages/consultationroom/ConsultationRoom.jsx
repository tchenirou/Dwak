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

  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [socket, setSocket] = useState(null);

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
        if (!remoteStream.getTrackById(track.id)) { // Prevent duplicate tracks
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
        console.log('Peer connection state changed:', peerConnection.connectionState);
        // Useful for debugging: 'new', 'connecting', 'connected', 'disconnected', 'failed', 'closed'
    };

    peerConnection.oniceconnectionstatechange = (event) => {
        console.log('ICE connection state changed:', peerConnection.iceConnectionState);
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
  };

  const leaveRoom = () => {
    if (window.confirm("Êtes-vous sûr de vouloir quitter la consultation ?")) {
      window.history.back();
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

  const otherUserLabel = userRole === "doctor" ? "Patient" : "Docteur";
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

      <div className="video-container">
        <div className="video-wrapper doctor-video">
          <video
            ref={userRole === "doctor" ? localVideoRef : remoteVideoRef}
            autoPlay
            playsInline
            muted={userRole === "doctor"}
            className="video-element"
          />
          <div className="video-label">
            {userRole === "doctor" ? "Vous" : otherUserLabel}
          </div>
          {userRole === "doctor" && (
            <div className="video-controls">
              <button onClick={toggleMic}>
                <FontAwesomeIcon
                  icon={isMicActive ? faMicrophone : faMicrophoneSlash}
                />
              </button>
              <button onClick={toggleCamera}>
                <FontAwesomeIcon
                  icon={isCameraActive ? faVideo : faVideoSlash}
                />
              </button>
              <button onClick={endCall}>
                <FontAwesomeIcon icon={faPhoneSlash} />
              </button>
            </div>
          )}
        </div>

        <div className="video-wrapper patient-video">
          <video
            ref={userRole === "patient" ? localVideoRef : remoteVideoRef}
            autoPlay
            playsInline
            muted={userRole === "patient"}
            className="video-element"
          />
          <div className="video-label">
            {userRole === "patient" ? "Vous" : otherUserLabel}
          </div>
          {userRole === "patient" && (
            <div className="video-controls">
              <button onClick={toggleMic}>
                <FontAwesomeIcon
                  icon={isMicActive ? faMicrophone : faMicrophoneSlash}
                />
              </button>
              <button onClick={toggleCamera}>
                <FontAwesomeIcon
                  icon={isCameraActive ? faVideo : faVideoSlash}
                />
              </button>
              <button onClick={endCall}>
                <FontAwesomeIcon icon={faPhoneSlash} />
              </button>
            </div>
          )}
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
                key={index}
                className={`message ${isSentByUser ? "sent" : "received"}`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="message-sender">{message.sender}</div>
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
  );
};

export default ConsultationRoom;
