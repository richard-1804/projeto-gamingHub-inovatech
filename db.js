// ESTE ARQUIVO É IMPORTANTE PARA CONEXÃO DO MYSQL COM O PRISMA ORM
// OBS: Não alterar este arquivo

import mariadb from 'mariadb'; 
import { PrismaMariaDb } from '@prisma/adapter-mariadb'; 
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';

dotenv.config();


const pool = mariadb.createPool({

  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seu_banco_de_dados',
  port: Number(process.env.DB_PORT) || 3306,
  

  rowsAsArray: false // Garante que o Prisma receba objetos do banco
});

const adapter = new PrismaMariaDb(pool); 
const prisma = new PrismaClient({ adapter });


// Buscar jogo por id no banco
export async function findGameById(id) {
  return await prisma.game.findUnique ({
    where: {id: Number(id) }
  });
}


// Atualizar dados de um jogo
export async function updateGame(id,data) {
  return await prisma.game.update({
    where: {id: Number(id)},
    data
  });
}

// Deletar jogo do banco de dados
export async function deleteGame(id) {
  return await prisma.game.delete({
    where: {id: Number(id)}
  });
}


export default prisma;


