const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nomeCompleto: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    enderecoFazenda: {
        type: String,
        required: true,
    },
    nomeFazenda: {
        type: String,
        required: true,
    },
    perfil: {
        type: String,
        required: true,
    },
    saveLogin: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);
