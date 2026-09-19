// Aqui fazemos a comunicação com o servidor nodemon
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Importação das Rotas
import authRoutes from './src/routes/authRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Verificação do funcionamento da API
app.get('/', (req, res) => {
  return res.status(200).json({ message: "API Gaming Hub rodando com sucesso" });
});

// Utilização das Rotas
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/games', gameRoutes);
app.use('/reviews', reviewRoutes);


// Servidor Iniciado
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});