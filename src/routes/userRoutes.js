const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
console.log(router)
router.post('/register', async (req, res) => {
    const { nomeCompleto, email, senha, telefone, enderecoFazenda, nomeFazenda, perfil, saveLogin } = req.body;

    try {
        // Verifica se todos os campos obrigatórios estão presentes
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
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
