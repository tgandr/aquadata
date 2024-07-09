require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');

// Middleware para CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://tgandr.github.io'], // Permitir a origem do GitHub Pages
    credentials: true,
}));

// Conectar ao MongoDB
connectDB(); // Chamar a função de conexão

// Middleware para parsing de JSON
app.use(express.json());

// Definir rotas
app.use('/api/users', require('./routes/userRoutes'));

console.log("teste")

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
