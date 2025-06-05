// socket/index.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware d'authentification pour Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = {
        id: user._id,
        role: user.role
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Rejoindre une salle personnelle pour les notifications
    socket.join(`user:${socket.user.id}`);
    
    // Événement pour rejoindre une conversation
    socket.on('join-conversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }
        
        // Vérifier si l'utilisateur est un participant
        if (!conversation.participants.includes(socket.user.id)) {
          socket.emit('error', { message: 'Not authorized to join this conversation' });
          return;
        }
        
        socket.join(`conversation:${conversationId}`);
        
        // Marquer les messages comme lus
        await Message.updateMany(
          { 
            conversationId,
            sender: { $ne: socket.user.id },
            'readBy.user': { $ne: socket.user.id }
          },
          { 
            $push: { 
              readBy: { 
                user: socket.user.id,
                readAt: new Date()
              } 
            } 
          }
        );
        
        // Mettre à jour le compteur de messages non lus
        const unreadCount = { ...conversation.unreadCount };
        unreadCount[socket.user.id] = 0;
        
        await Conversation.findByIdAndUpdate(
          conversationId,
          { unreadCount }
        );
        
        socket.emit('messages-read');
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Événement pour envoyer un message
    socket.on('send-message', async (data) => {
      try {
        const { conversationId, content, contentType = 'text', fileUrl, fileName, fileSize } = data;
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }
        
        // Vérifier si l'utilisateur est un participant
        if (!conversation.participants.includes(socket.user.id)) {
          socket.emit('error', { message: 'Not authorized to send messages in this conversation' });
          return;
        }
        
        // Créer le nouveau message
        const newMessage = new Message({
          conversationId,
          sender: socket.user.id,
          content,
          contentType,
          fileUrl,
          fileName,
          fileSize,
          readBy: [{ user: socket.user.id }]
        });
        
        await newMessage.save();
        
        // Mettre à jour la conversation
        const unreadCount = { ...conversation.unreadCount };
        
        // Incrémenter le compteur de messages non lus pour tous les participants sauf l'expéditeur
        conversation.participants.forEach(participantId => {
          if (participantId.toString() !== socket.user.id.toString()) {
            unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
          }
        });
        
        await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: newMessage._id,
            unreadCount,
            updatedAt: new Date()
          }
        );
        
        // Récupérer le message avec les informations de l'expéditeur
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'firstName lastName profileImage');
        
        // Envoyer le message à tous les participants de la conversation
        io.to(`conversation:${conversationId}`).emit('new-message', populatedMessage);
        
        // Envoyer des notifications aux participants qui ne sont pas dans la conversation
        conversation.participants.forEach(participantId => {
          if (participantId.toString() !== socket.user.id.toString()) {
            io.to(`user:${participantId}`).emit('message-notification', {
              conversationId,
              message: populatedMessage
            });
          }
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Événement pour les appels vidéo
    socket.on('video-call-request', async (data) => {
      try {
        const { conversationId, recipientId } = data;
        
        // Vérifier si l'utilisateur est autorisé à appeler
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }
        
        if (!conversation.participants.includes(socket.user.id) || 
            !conversation.participants.includes(recipientId)) {
          socket.emit('error', { message: 'Not authorized to initiate this call' });
          return;
        }
        
        // Enregistrer l'appel comme un message
        const callMessage = new Message({
          conversationId,
          sender: socket.user.id,
          content: 'Appel vidéo',
          contentType: 'video-call',
          readBy: [{ user: socket.user.id }]
        });
        
        await callMessage.save();
        
        // Mettre à jour la conversation
        await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: callMessage._id,
            updatedAt: new Date()
          }
        );
        
        // Envoyer la demande d'appel au destinataire
        io.to(`user:${recipientId}`).emit('incoming-call', {
          callerId: socket.user.id,
          conversationId,
          messageId: callMessage._id
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Événement pour la signalisation WebRTC
    socket.on('webrtc-signal', (data) => {
      const { recipientId, signal } = data;
      io.to(`user:${recipientId}`).emit('webrtc-signal', {
        callerId: socket.user.id,
        signal
      });
    });
    
    // Événement pour terminer un appel
    socket.on('end-call', (data) => {
      const { recipientId } = data;
      io.to(`user:${recipientId}`).emit('call-ended', {
        callerId: socket.user.id
      });
    });
    
    // Événement pour la déconnexion
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};
