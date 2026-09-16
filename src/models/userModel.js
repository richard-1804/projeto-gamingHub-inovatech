// Lógica de banco de dados para Usuários (buscar por e-mail para login, criar novo usuário, etc.).

import prisma from '../../db.js';

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id_users_pk: true, 
      name: true,
      email: true,
      created_at: true   
    }
  });
};