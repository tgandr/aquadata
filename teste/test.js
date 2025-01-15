const mongoose = require('mongoose');
require('dotenv').config(); // Certifique-se de que o .env está sendo carregado

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => {
        console.error('Erro de conexão:', err);
        process.exit(1); // Finaliza o processo em caso de erro de conexão
    });

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

const testFunction = async () => {
    try {
        const doc = await Test.create({ name: 'Test Document' });
        console.log('Document created:', doc);
    } catch (error) {
        console.error('Error during CRUD operation:', error);
    }
};

testFunction();
