const mongoose = require('mongoose');

// Removido o código de inicialização do servidor e a criação do aplicativo Express
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
    console.error("Erro: MONGO_URI não está definida no .env");
    process.exit(1); // Encerra o processo se MONGO_URI não estiver definida
}

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Encerrar o processo em caso de erro na conexão
    }
};

// Removido a chamada imediata para connectDB e a inicialização do servidor
module.exports = connectDB;
