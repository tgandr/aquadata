const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sua URL de conexão com o MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb+srv://silvathiago:ENmfaLuVgOmnM6Mq@cluster0.zvbnjqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
};

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = connectDB;
