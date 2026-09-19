// Rotas de avaliações dos jogos.

import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { createReviewSchema, gameIdParamSchema, reviewIdParamSchema } from '../schemas/reviewSchema.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


// Middlewares de Validação
const validateCreateReview = (req, res, next) => {
  try {
    createReviewSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro! Dados inválidos ou incompletos",
      erro: error.issues
    });
  }
};

const validateGameIdParam = (req, res, next) => {
  try {
    gameIdParamSchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({ erro: "Parâmetro Inválido", detalhes: error.issues });
  }
};

const validateReviewIdParam = (req, res, next) => {
  try {
    reviewIdParamSchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({
      erro: "Parâmetro Inválido",
      detalhes: error.issues.map(issue => issue.message)
    });
  }
};


// 1. POST /reviews -> Criar avaliação (Protegido por JWT)
router.post('/', authMiddleware, validateCreateReview, reviewController.createReview);

// 2. GET /reviews/game/:gameId -> Listar avaliações de um jogo específico (Público)
router.get('/game/:gameId', validateGameIdParam, reviewController.getReviewsByGame);

// 3. DELETE /reviews/:id -> Remover uma avaliação (Protegido por JWT)
router.delete('/:id', authMiddleware, validateReviewIdParam, reviewController.deleteReview);

export default router;