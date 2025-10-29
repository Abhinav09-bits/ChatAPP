const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// All message routes are protected
router.use(authMiddleware);

// Message routes
router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.put('/mark-read/:userId', markAsRead);
router.delete('/:messageId', deleteMessage);

module.exports = router;
