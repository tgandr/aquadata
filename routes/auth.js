// routes/auth.js
const express = require('express');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Register Route
console.log('estou vivo')
router.post('/register', async (req, res) => {
    console.log('auth', req)
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
        email,
        password: hashedPassword,
        verificationCode
    });

    await newUser.save();
    sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'User registered. Check your email for verification code.' });
});

// Verify Email Route
router.post('/verify-email', async (req, res) => {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode });
    if (!user) {
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
        return res.status(400).json({ error: 'Email not verified' });
    }

    // Generate JWT (or any other token mechanism) and send to client
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
});

module.exports = router;
