import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoomList({ interests, setRoom }) {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const interestQuery = interests.join(',');
                const response = await axios.get(`http://localhost:5000/api/rooms/suggest?q=${interestQuery}`);
                setRooms(response.data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError('Failed to load rooms. Please try again later.');
            }
        };

        fetchRooms();
    }, [interests]);

    const handleCreateRoom = async () => {
        if (!newRoomName) {
            setError('Room name cannot be empty');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/rooms/create', {
                name: newRoomName,
                isPrivate,
                passcode: isPrivate ? passcode : undefined,
            });
            setRoom(response.data._id);
        } catch (error) {
            console.error("Error creating room:", error);
            setError(error.response?.data?.message || 'Failed to create room. Please try again.');
        }
    };

    return (
        <div className="room-list">
            <h1>Suggested Channels</h1>
            {error && <p className="error">{error}</p>}
            <ul>
                {rooms.map((room) => (
                    <li key={room._id} onClick={() => setRoom(room._id)}>
                        #{room.name}
                    </li>
                ))}
            </ul>
            <h2>Create a New Channel</h2>
            <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter channel name"
                className="new-room-input"
            />
            <label>
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                />
                Private Channel
            </label>
            {isPrivate && (
                <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode"
                    className="passcode-input"
                />
            )}
            <button onClick={handleCreateRoom}>Create Channel</button>
        </div>
    );
}

export default RoomList;
