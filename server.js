const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const Message = require('./models/Message');  // Ensure this path is correct
const Room = require('./models/Room');        // Ensure this path is correct

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from your React app
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:3000", // Allow requests from your React app
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// API Routes

// Suggest channels based on user interests
app.get('/api/rooms/suggest', async (req, res) => {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const rooms = await Room.find({ name: regex }).limit(10);
    res.json(rooms);
});

// Create a new room, with support for private channels
app.post('/api/rooms/create', async (req, res) => {
    const { name, isPrivate, passcode } = req.body;
    const existingRoom = await Room.findOne({ name });

    if (existingRoom) {
        return res.status(400).json({ message: 'Room already exists' });
    }

    const newRoom = new Room({
        name,
        isPrivate: isPrivate || false,
        passcode: isPrivate ? passcode : null
    });
    await newRoom.save();

    res.status(201).json(newRoom);
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinRoom', async ({ roomId, username, passcode }) => {
        const room = await Room.findById(roomId);

        if (!room) {
            return socket.emit('error', 'Room not found');
        }

        if (room.isPrivate && room.passcode !== passcode) {
            return socket.emit('error', 'Incorrect passcode');
        }

        console.log(`User ${username} joined room ${roomId}`);
        socket.join(roomId);

        // Fetch and send the room's message history
        try {
            const messages = await Message.find({ roomId }).sort('timestamp');
            console.log('Sending message history:', messages);
            socket.emit('messageHistory', messages);
        } catch (error) {
            console.error('Error fetching message history:', error);
        }
    });

    socket.on('sendMessage', async ({ roomId, messageContent, sender }) => {
        console.log(`Received message from ${sender}: ${messageContent} in room ${roomId}`);
    
        const message = new Message({
            roomId,
            sender,
            content: messageContent
        });
    
        try {
            await message.save();
            console.log('Message saved to database:', message);
            io.to(roomId).emit('message', message);
        } catch (error) {
            console.error('Error saving message to database:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
