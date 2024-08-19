import React, { useState } from 'react';

function InterestInput({ onSubmit }) {
    const [interest, setInterest] = useState('');
    const [interestList, setInterestList] = useState([]);

    const handleAddInterest = () => {
        if (interest && !interestList.includes(interest)) {
            setInterestList([...interestList, interest]);
            setInterest('');
        }
    };

    const handleSubmit = () => {
        if (interestList.length === 4) {
            onSubmit(interestList);
        }
    };

    return (
        <div className="interest-input">
            <h1>Enter Your Interests (4)</h1>
            <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Enter an interest"
                className="interest-input-field"
            />
            <button onClick={handleAddInterest} disabled={interestList.length >= 4}>
                Add Interest
            </button>
            <ul>
                {interestList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            {interestList.length === 4 && (
                <button onClick={handleSubmit}>Submit Interests</button>
            )}
        </div>
    );
}

export default InterestInput;
