// Lógica de banco para Avaliações (criar review, listar reviews de um jogo).

import prisma from '../../db.js';

// 1. Criar uma nova avaliação no banco

export const createReview = async ({ rating, comment, games_id_fk, users_id_fk }) => {
  return await prisma.reviews.create({
    data: {
      rating,
      comment,
      games_id_fk,
      users_id_fk,
    },
  });
};

// 2. Buscar todas as avaliações de um jogo específico

export const getReviewsByGameId = async (gameId) => {
  return await prisma.reviews.findMany({
    where: {
      games_id_fk: Number(gameId),
    },
    // Traz também as informações do usuário que fez a avaliação
    
    include: {
      users: {
        select: {
          id_users_pk: true,
          name: true, // Ou outro campo do seu model de usuário (ex: username, email)
        },
      },
    },
    orderBy: {
      created_at: 'desc', // Ordena das mais recentes para as mais antigas
    },
  });
};

// 3. Buscar uma avaliação específica pelo ID (útil para validar se ela existe/pertence ao usuário)
export const getReviewById = async (id) => {
  return await prisma.reviews.findUnique({
    where: {
      id_reviews_pk: Number(id),
    },
  });
};

// 4. Deletar uma avaliação pelo ID
export const deleteReview = async (id) => {
  return await prisma.reviews.delete({
    where: {
      id_reviews_pk: Number(id),
    },
  });
};

