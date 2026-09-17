import prisma from '../../db.js';

// 1. Listar todos os jogos (Público)
export async function listGames(req, res) {
  try {
    const games = await prisma.games.findMany({
      include: { categories: true }
    });
    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar jogos", error: error.message });
  }
}

// 2. Buscar jogo por ID (Público)
export async function getGameById(req, res) {
  try {
    const gameId = Number(req.params.id);

    const game = await prisma.games.findUnique({
      where: { id_games_pk: gameId },
      include: { categories: true, reviews: true }
    });

    if (!game) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar jogo.", error: error.message });
  }
}

// 3. Criar jogo (Protegido por JWT)
export async function createGame(req, res) {
  try {
    const newGame = await prisma.games.create({
      data: req.body
    });
    return res.status(201).json(newGame);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar jogo.", error: error.message });
  }
}

// 4. Atualizar jogo (Protegido por JWT)
export async function updateGameController(req, res) {
  try {
    const gameId = Number(req.params.id);

    const existingGame = await prisma.games.findUnique({
      where: { id_games_pk: gameId }
    });

    if (!existingGame) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    const updatedGame = await prisma.games.update({
      where: { id_games_pk: gameId },
      data: req.body
    });

    return res.status(200).json(updatedGame);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
  }
}

// 5. Deletar jogo (Protegido por JWT)
export async function deleteGameController(req, res) {
  try {
    const gameId = Number(req.params.id);

    const existingGame = await prisma.games.findUnique({
      where: { id_games_pk: gameId }
    });

    if (!existingGame) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    await prisma.games.delete({
      where: { id_games_pk: gameId }
    });

    return res.status(200).json({ message: "Jogo removido com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
  }
}