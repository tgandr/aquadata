require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const https = require('https');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

// Middleware para CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://tgandr.github.io'],
    credentials: true,
}));

// Conectar ao MongoDB
connectDB(); // Chamar a função de conexão

// Middleware para parsing de JSON
app.use(express.json());

// Definir rotas
app.use('/api/users', require('./src/routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/data', (req, res) => {
    const data = req.body;
    res.send(`You sent: ${JSON.stringify(data)}`);
});

app.listen(5000, () => {
    console.log('Servidor HTTP rodando na porta 5000');
});

// Configurar o servidor HTTPS
https.createServer(credentials, app)
    .listen(5000, () => {
        console.log('Servidor HTTPS rodando na porta 5000');
    });
