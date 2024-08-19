import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ChatRoom({ roomId, username }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log('Connecting to server...');
        socket.emit('joinRoom', { roomId, username });

        socket.on('messageHistory', (messages) => {
            console.log('Received message history:', messages);
            setMessages(messages);
        });

        socket.on('message', (message) => {
            console.log('New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            console.log('Leaving room...');
            socket.emit('leaveRoom', roomId);
            socket.off();
        };
    }, [roomId, username]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            console.log('Sending message:', message);
            socket.emit('sendMessage', { roomId, messageContent: message, sender: username });
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Room: {roomId}</h2>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatRoom;



