// Lógica para criação e consulta de avaliações.

import * as reviewModel from '../models/reviewModel.js';

// 1. Criar uma nova avaliação (POST /reviews)

export const createReview = async (req, res) => {
  try {
    const { rating, comment, games_id_fk } = req.body;
    
    // O id do usuário vem do token JWT decodificado pelo middleware de autenticação

    const users_id_fk = req.user.id;

    const newReview = await reviewModel.createReview({
      rating,
      comment,
      games_id_fk,
      users_id_fk,
    });

    return res.status(201).json({
      message: 'Avaliação criada com sucesso!',
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro interno ao criar avaliação.', 
      error: error.message 
    });
  }
};

// 2. Listar avaliações de um jogo (GET /reviews/game/:gameId)

export const getReviewsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const reviews = await reviewModel.getReviewsByGameId(gameId);

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao buscar avaliações do jogo.', 
      error: error.message 
    });
  }
};

// 3. Deletar uma avaliação (DELETE /reviews/:id)

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ID do usuário vindo do JWT

    // 1. Verifica se a avaliação existe no banco

    const review = await reviewModel.getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: 'Avaliação não encontrada.' });
    }

    // 2. Regra de Autorização: Garante que o usuário só pode deletar a PRÓPRIA avaliação
    
    if (review.users_id_fk !== userId) {
      return res.status(403).json({ 
        message: 'Acesso negado: Você não tem permissão para deletar esta avaliação.' 
      });
    }

    // 3. Remove a avaliação
    await reviewModel.deleteReview(id);

    return res.status(200).json({ message: 'Avaliação removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao deletar a avaliação.', 
      error: error.message 
    });
  }
};