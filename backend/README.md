# Chat App Backend

A complete backend boilerplate for a real-time chat application built with Node.js, Express.js, MongoDB, and Socket.io.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Real-time Messaging**: Socket.io for instant message delivery
- **Message Management**: Send, receive, delete messages with read status
- **User Status**: Online/offline status tracking
- **Typing Indicators**: Real-time typing status
- **Conversation Management**: Get all conversations with unread counts
- **MongoDB Integration**: Mongoose ODM with proper schemas
- **CORS Support**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## 📁 Project Structure

```
backend/
├── index.js                 # Main server file with Socket.io setup
├── package.json             # Dependencies and scripts
├── config/
│   └── db.js               # MongoDB connection configuration
├── models/
│   ├── User.js             # User schema with authentication
│   └── Message.js          # Message schema with relationships
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── messageController.js # Message CRUD operations
├── routes/
│   ├── authRoutes.js       # Authentication endpoints
│   └── messageRoutes.js    # Message endpoints
└── middleware/
    └── authMiddleware.js   # JWT authentication middleware
```

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Run the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)

### Message Routes (`/api/messages`)

- `POST /send` - Send a message (protected)
- `GET /conversations` - Get all conversations (protected)
- `GET /:userId` - Get messages with specific user (protected)
- `PUT /mark-read/:userId` - Mark messages as read (protected)
- `DELETE /:messageId` - Delete a message (protected)

## 🔌 Socket.io Events

### Client to Server Events

- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `mark_read` - Mark messages as read
- `update_status` - Update user online status

### Server to Client Events

- `receive_message` - Receive a new message
- `message_sent` - Confirmation of sent message
- `user_typing` - User typing status
- `messages_read` - Messages marked as read
- `user_status_update` - User online status update
- `error` - Error messages

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String (required),
  messageType: String (text/image/file),
  isRead: Boolean,
  readAt: Date,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🚦 Socket.io Authentication

Connect to Socket.io with authentication:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## 🧪 Testing the API

You can test the API using tools like Postman or curl:

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 Development

- The server runs on port 5000 by default
- Socket.io is configured for CORS with the client URL
- MongoDB connection is established automatically
- All routes are properly documented and error-handled

## 📝 Notes

- Passwords are automatically hashed using bcrypt
- JWT tokens expire after 7 days by default
- All message routes require authentication
- Socket.io connections are authenticated using JWT
- User online status is automatically managed
- Messages are paginated for better performance

## 🚀 Next Steps

1. Set up your MongoDB database
2. Configure your environment variables
3. Install dependencies and start the server
4. Connect your frontend application
5. Test the real-time messaging functionality

Happy coding! 🎉
