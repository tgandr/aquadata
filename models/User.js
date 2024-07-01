// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String }
});

// Middleware para hash da senha antes de salvar no banco de dados
UserSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) return next();

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password along with our new salt
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Override the plaintext password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar a senha fornecida com a senha armazenada no banco de dados
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('User', UserSchema);
