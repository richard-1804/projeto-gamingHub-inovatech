// Rotas de avaliações dos jogos.

import  express  from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { createReviewSchema, reviewParamSchema } from '../schemas/reviewSchema.js';

// Middlewares necessários do seu projeto

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


// Validação

const validadeCreateReview = (req, res, next) => {
  try {
    createReviewSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro! Dados inválidos ou incompletos",
      erro: error.issues})
  }
};

const validadeReviewId = (req, res, next) => {
  try {
    reviewParamSchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({erro: "Parâmetro Inválido", detalhes: error.issues})
  }
};

const validateDeleteReview = (req, res, next) => {
  try {
    reviewParamSchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({
      erro: "Parâmetro Inválido",
      detalhes: error.issues.map(issue => issue.message) // Mostra mensagens amigáveis
    });
  }
};


// 1. POST /reviews -> Criar avaliação

router.post('/', authMiddleware, validadeCreateReview, reviewController.createReview);

// 2. GET /reviews/game/:gameId -> Listar avaliações de um jogo específico

router.get('/:id', validadeReviewId,  reviewController.getReviewsByGame);

// 3. DELETE /reviews/:id -> Remover uma avaliação

router.delete('/:id', authMiddleware, validateDeleteReview, reviewController.deleteReview
);

export default router;