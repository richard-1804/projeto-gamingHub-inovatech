// Aqui fazemos a comunicação com o servidor nodemon

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Código de exemplo
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
