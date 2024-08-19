import React, { useState } from 'react';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import InterestInput from './components/InterestInput';
import './styles.css';

function App() {
    const [interests, setInterests] = useState([]);
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');

    const handleInterestsSubmit = (submittedInterests) => {
        setInterests(submittedInterests);
    };

    return (
        <div className="App">
            {!interests.length ? (
                <InterestInput onSubmit={handleInterestsSubmit} />
            ) : !room ? (
                <div>
                    <h1>Enter Username</h1>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="username-input"
                    />
                    {username && <RoomList interests={interests} setRoom={setRoom} />}
                </div>
            ) : (
                <ChatRoom roomId={room} username={username} />
            )}
        </div>
    );
}

export default App;
