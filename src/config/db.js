const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sua URL de conexão com o MongoDB
const dbURI = process.env.MONGODB_URI || 'your_mongodb_connection_string_here';

mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});


module.exports = connectDB;
