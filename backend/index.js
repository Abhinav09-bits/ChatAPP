const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variabl/es
dotenv.config();


// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Import models
const User = require('./models/User');
const Message = require('./models/Message');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (${socket.userId})`);

  // Update user online status
  User.findByIdAndUpdate(socket.userId, { isOnline: true })
    .catch(err => console.error('Error updating user online status:', err));

  // Join user to their personal room
  socket.join(socket.userId);

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;

      // Validate data
      if (!receiverId || !content) {
        socket.emit('error', { message: 'Receiver ID and content are required' });
        return;
      }

      // Check if receiver exists
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        socket.emit('error', { message: 'Receiver not found' });
        return;
      }

      // Create message
      const message = new Message({
        senderId: socket.userId,
        receiverId,
        content,
        messageType
      });

      await message.save();

      // Populate message with user details
      await message.populate([
        { path: 'senderId', select: 'username email' },
        { path: 'receiverId', select: 'username email' }
      ]);

      // Emit message to receiver
      socket.to(receiverId).emit('receive_message', message);

      // Emit confirmation to sender
      socket.emit('message_sent', message);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { receiverId } = data;
    socket.to(receiverId).emit('user_typing', {
      userId: socket.userId,
      username: socket.user.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { receiverId } = data;
    socket.to(receiverId).emit('user_typing', {
      userId: socket.userId,
      username: socket.user.username,
      isTyping: false
    });
  });

  // Handle message read status
  socket.on('mark_read', async (data) => {
    try {
      const { senderId } = data;
      
      await Message.updateMany(
        { senderId, receiverId: socket.userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Notify sender that messages were read
      socket.to(senderId).emit('messages_read', {
        userId: socket.userId,
        username: socket.user.username
      });

    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  // Handle user status updates
  socket.on('update_status', async (data) => {
    try {
      const { isOnline } = data;
      
      await User.findByIdAndUpdate(socket.userId, {
        isOnline,
        lastSeen: new Date()
      });

      // Broadcast status update to all connected users
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        username: socket.user.username,
        isOnline,
        lastSeen: new Date()
      });

    } catch (error) {
      console.error('Update status error:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);

    try {
      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Broadcast user offline status
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        username: socket.user.username,
        isOnline: false,
        lastSeen: new Date()
      });

    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
