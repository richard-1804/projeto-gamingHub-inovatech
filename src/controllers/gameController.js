// Lógica do CRUD dos jogos utilizando o tratamento try/catch para capturar os erros disparados pelo .parse() do Zod.


import { gameSchema, gaidpar, idParamSchema, updateGameSchema } from "../schemas/gameSchema.js"

export async function listGames(req, res) {
    try {
        games = await gameModel.findMany({
            include: { categories: true } //vai criar relacionamento com a tabela categories
        })
        return res.status(200).json(games)

    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar jogos" })
    }
}

export async function getGameById(req, res) {
    try {
        idvalidado = gaidpar.parse({ id: req.params.id })

        game = await gameModel.findUnique({
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

export async function createGame(req, res) {
    try {
        dadosValidados = gameSchema.parse(req.body)
        novoGame = await gameModel.create({
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

// Função de atualizar o jogo

export async function updateGameController(req, res) {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Consulta direta no Prisma
    const existingGame = await gameModel.findUnique({
      where: { id }
    });

    if (!existingGame) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    const validatedData = updateGameSchema.parse(req.body);

    // Atualização direta no Prisma
    const updatedGame = await gameModel.update({
      where: { id },
      data: validatedData
    });

    return res.status(200).json(updatedGame);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

// Função de deletar o jogo 

export async function deleteGameController(req, res) {
  try {
    const { id } = idParamSchema.parse(req.params);

    const existingGame = await gameModel.findUnique({
      where: { id }
    });

    if (!existingGame) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    // Deleção direta no Prisma
    await gameModel.delete({
      where: { id }
    });

    return res.status(200).json({ message: "Jogo removido com sucesso." });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}