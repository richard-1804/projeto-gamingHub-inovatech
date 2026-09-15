// Lógica do CRUD dos jogos utilizando o tratamento try/catch para capturar os erros disparados pelo .parse() do Zod.

import prisma from "../../db.js";
import { gameSchema, gaidpar } from "../schemas/gameSchema.js"

async function listGames(req, res) {
    try {
        games = await prisma.games().findMany({
            include: { categories: true } //vai criar relacionamento com a tabela categories
        })
        return res.status(200).json(games)

    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar jogos" })
    }
}

async function getGameById(req, res) {
    try {
        idvalidado = gaidpar.parse({ id: req.params.id })

        game = await prisma.games.findUnique({
            where: { id_games_pk: idValidado.id },
            include: { categories: true }
        })
        if (game !== true) {
            return res.status(404).json({ message: "Jogo não encontrado" })
        }
    } catch (error) {
        if (error == zod) {
            return res.status(400).json({ error: error.issues })
        } else {
            return res.status(500).json({ message: "Erro ao buscar jogo" })
        }

    }
}

async function createGame(req, res) {
    try {
        dadosValidados = gameSchema.parse(req.body)
        novoGame = await prisma.games.create({
            data: dadosValidados
        })
        return res.status(201).json(novoGame)
    } catch (error) {
        if (error == zod) {
            return res.status(400).json({ error: error.issues })
        } else {
            return res.status(500).json({ message: "Erro ao criar jogo" })
        }
    }
}

export { listGames, getGameById, createGame }