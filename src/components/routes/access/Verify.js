import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Verify = () => {
    const [code, setCode] = useState('');
    const history = useHistory();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            if (response.ok) {
                history.push('/success'); // Redirect after successful verification
            } else {
                alert('Invalid verification code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('An error occurred during verification');
        }
    };

    return (
        <div>
            <h2>Verify Your Email</h2>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    required
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default Verify;