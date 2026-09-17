import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { gameSchema, updateGameSchema, idParamSchema } from '../schemas/gameSchema.js';

const router = express.Router();

// Middlewares de Validação Zod
const validateGameBody = (req, res, next) => {
  try {
    gameSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "Dados do jogo inválidos", erro: error.issues });
  }
};

const validateUpdateGameBody = (req, res, next) => {
  try {
    updateGameSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "Dados para atualização inválidos", erro: error.issues });
  }
};

const validateGameIdParam = (req, res, next) => {
  try {
    idParamSchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "ID do jogo inválido", erro: error.issues });
  }
};

// Configuração das Rotas
router.get('/', gameController.listGames);
router.get('/:id', validateGameIdParam, gameController.getGameById);
router.post('/', authMiddleware, validateGameBody, gameController.createGame);
router.put('/:id', authMiddleware, validateGameIdParam, validateUpdateGameBody, gameController.updateGameController);
router.delete('/:id', authMiddleware, validateGameIdParam, gameController.deleteGameController);

export default router;