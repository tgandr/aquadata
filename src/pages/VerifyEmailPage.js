// src/pages/VerifyEmailPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/VerifyEmailPage.css';

const VerifyEmailPage = () => {
    const [form, setForm] = useState({
        email: '',
        verificationCode: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Email verified successfully. You can now log in.');
                // Optionally navigate to login page
                navigate('/login');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="verify-email-page">
            <h2>Verify Email</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="text" name="verificationCode" placeholder="Verification Code" value={form.verificationCode} onChange={handleChange} required />
                {message && <p>{message}</p>}
                <button type="submit">Verify Email</button>
            </form>
        </div>
    );
};

export default VerifyEmailPage;
