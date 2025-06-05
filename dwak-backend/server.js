const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('DWAK Backend is running');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.IO signaling logic
// Keep track of users in rooms (simple mapping for 2-person rooms)
const roomMap = {}; // roomId: [socketId1, socketId2]

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
    
    // Add socket to the room map
    if (!roomMap[roomId]) {
        roomMap[roomId] = [];
    }
    if (!roomMap[roomId].includes(socket.id)) {
        roomMap[roomId].push(socket.id);
    }

    socket.join(roomId);

    // Get all clients in the room after this socket joined
    const clients = await io.in(roomId).allSockets();
    const clientIds = Array.from(clients);

    console.log(`👥 Current room ${roomId} users:`, clientIds);
    io.to(roomId).emit("roomUsers", clientIds); // Tell everyone who is in the room

    // If there's another user in the room, tell them that a new user is ready for a call.
    // This effectively prompts the existing user to send an offer.
    if (clientIds.length === 2) {
        const otherSocketId = clientIds.find(id => id !== socket.id);
        if (otherSocketId) {
            io.to(otherSocketId).emit("newPeerReady", socket.id); // Tell the existing peer that a new peer (socket.id) is ready
            io.to(socket.id).emit("initiatorSignal"); // Tell the new peer if it needs to wait for an offer or initiate
        }
    }
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    console.log(`✉️ Message in room ${roomId}:`, message);
    socket.to(roomId).emit("receiveMessage", message);
  });

  // No need for a separate "ready" signal if we handle it with newPeerReady/initiatorSignal
  // socket.on("ready", (roomId) => {
  //   console.log(`🟢 Ready signal in room ${roomId}`);
  //   socket.to(roomId).emit("ready");
  // });

  socket.on("offer", ({ roomId, offer }) => {
    console.log(`📡 Offer from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("offer", { offer, senderId: socket.id }); // Add senderId for debugging
  });

  socket.on("answer", ({ roomId, answer }) => {
    console.log(`📡 Answer from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("answer", { answer, senderId: socket.id }); // Add senderId for debugging
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    console.log(`❄️ ICE Candidate from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("ice-candidate", { candidate, senderId: socket.id }); // Add senderId
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    // Remove socket from roomMap when disconnected
    for (const roomId in roomMap) {
        roomMap[roomId] = roomMap[roomId].filter(id => id !== socket.id);
        if (roomMap[roomId].length === 0) {
            delete roomMap[roomId]; // Clean up empty rooms
        } else {
            // If the room still exists, inform remaining users about the disconnect
            io.to(roomId).emit("peerDisconnected", socket.id);
        }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
