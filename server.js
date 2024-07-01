const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Importe as rotas de autenticação

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Utilize o prefixo correto para suas rotas
app.use('/aquadata/api/users', authRoutes); // Utilize o caminho correto conforme sua estrutura de pastas

// Defina a rota raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor do backend!');
});

// Middleware para tratar 404 - Página não encontrada
app.use((req, res, next) => {
    res.status(404).send("Página não encontrada");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
