// models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  type: {
    type: String,
    enum: ['doctor-patient', 'admin-doctor', 'admin-patient'],
    default: 'doctor-patient'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);