// routes/conversations.js
const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/user');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Obtenir toutes les conversations de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      isActive: true
    })
    .populate('participants', 'firstName lastName profileImage role')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une nouvelle conversation
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    // Vérifier si le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Destinataire non trouvé' });
    }
    
    // Vérifier les autorisations (un patient ne peut parler qu'à un médecin et vice versa)
    if (req.user.role === 'patient' && recipient.role !== 'doctor') {
      return res.status(403).json({ message: 'Vous ne pouvez créer une conversation qu\'avec un médecin' });
    }
    
    if (req.user.role === 'doctor' && recipient.role !== 'patient') {
      return res.status(403).json({ message: 'Vous ne pouvez créer une conversation qu\'avec un patient' });
    }
    
    // Vérifier si une conversation existe déjà
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
      isActive: true
    });
    
    if (existingConversation) {
      return res.json(existingConversation);
    }
    
    // Créer une nouvelle conversation
    const newConversation = new Conversation({
      participants: [req.user.id, recipientId],
      type: 'doctor-patient',
      unreadCount: {
        [req.user.id]: 0,
        [recipientId]: 0
      }
    });
    
    await newConversation.save();
    
    // Retourner la conversation avec les informations des participants
    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate('participants', 'firstName lastName profileImage role');
    
    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les messages d'une conversation
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    // Vérifier si l'utilisateur est un participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette conversation' });
    }
    
    // Récupérer les messages avec pagination
    const messages = await Message.find({ conversationId: id })
      .populate('sender', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Compter le nombre total de messages
    const total = await Message.countDocuments({ conversationId: id });
    
    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marquer tous les messages comme lus
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    // Vérifier si l'utilisateur est un participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette conversation' });
    }
    
    // Marquer les messages comme lus
    await Message.updateMany(
      { 
        conversationId: id,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      { 
        $push: { 
          readBy: { 
            user: req.user.id,
            readAt: new Date()
          } 
        } 
      }
    );
    
    // Mettre à jour le compteur de messages non lus
    const unreadCount = { ...conversation.unreadCount };
    unreadCount[req.user.id] = 0;
    
    await Conversation.findByIdAndUpdate(
      id,
      { unreadCount }
    );
    
    res.json({ message: 'Messages marqués comme lus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
