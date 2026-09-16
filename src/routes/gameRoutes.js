// Rotas para a entidade principal de jogos (GET /games, POST /games, GET /games/:id, etc.).
import express from 'express';
import { listGames, getGameById, createGame, updateGameController, deleteGameController } from "../controllers/gameController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/games", listGames) // parte publica
router.get("/games/:id", authMiddleware, getGameById) // parte protegida
router.post("/games", authMiddleware, createGame) //parte protegida
router.put("/games/:id", authMiddleware, updateGameController ); //Rota put protegida
router.delete('/games/:id', authMiddleware, deleteGameController); // Rota delete protegida

export default router;