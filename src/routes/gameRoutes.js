// Rotas para a entidade principal de jogos (GET /games, POST /games, GET /games/:id, etc.).
import Router from "express"
import { listGames, getGameById, createGame } from "../controllers/gameController"
import authMiddleware from "../middleware/authMiddleware"

router = Router()

router.GET("/games", listGames) // parte publica
router.GET("/games/:id", authMiddleware, getGameById) // parte protegida
router.POST("/games", authMiddleware, createGame) //parte protegida

export { router }