const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../utils/auth');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { nomeCompleto, email, senha, telefone, enderecoFazenda, nomeFazenda, perfil, saveLogin } = req.body;

    try {
        if (!nomeCompleto || !email || !senha || !telefone || !enderecoFazenda || !nomeFazenda || !perfil) {
            return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios' });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe' });
        }

        user = new User({
            nomeCompleto,
            email,
            senha,
            telefone,
            enderecoFazenda,
            nomeFazenda,
            perfil,
            saveLogin,
        });

        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(senha, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, msg: 'Usuário registrado com sucesso' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        let user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                const userResponse = {
                    token,
                    user: {
                        nomeCompleto: user.nomeCompleto,
                        email: user.email,
                        telefone: user.telefone,
                        enderecoFazenda: user.enderecoFazenda,
                        nomeFazenda: user.nomeFazenda,
                        perfil: user.perfil
                    }
                };
                console.log('Login user response:', userResponse);  // Log da resposta do usuário
                res.json(userResponse);
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-senha');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
