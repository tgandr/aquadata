require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const fs = require('fs');
const https = require('https');  // Módulo para HTTPS

const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

// Middleware para CORS
app.use(cors({
    origin: ['http://localhost:5000', 'https://tgandr.github.io'], // Permitir a origem do GitHub Pages
    // origin: ['http://localhost:3000', 'http://ec2-3-208-8-220.compute-1.amazonaws.com'], // Permitir a origem do GitHub Pages

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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Caminhos para os certificados SSL gerados
const options = {
    key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
    cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt'),
};

// Iniciar o servidor HTTPS
// https.createServer(options, app).listen(443, () => {
//     console.log(`Server is running on https://localhost:${port}`);
// });

https.createServer(options, app).listen(5000, () => {
    console.log('Server is running on https://localhost:5000');
});

// Redirecionar todo o tráfego HTTP para HTTPS
// const http = require('http');
// http.createServer((req, res) => {
//     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//     res.end();
// }).listen(80);  // Escutando na porta HTTP