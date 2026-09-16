// Schemas para validação de dados de avaliações.

import { z } from 'zod';

// Validação para a criação de uma review (POST /reviews)

export const createReviewSchema = z.object({
  rating: z
    .number({ required_error: "A nota é obrigatória." })
    .int("A nota deve ser um número inteiro.")
    .min(1, "A nota mínima é 1.")
    .max(5, "A nota máxima é 5."),
  
  comment: z

    .string()
    .trim()
    .optional(), // Ou .min(1) se for obrigatório
    
  games_id_fk: z

    .number({ required_error: "O ID do jogo é obrigatório." })
    .int()
    .positive("ID do jogo inválido.")
});

// Opcional: Validação de parâmetros de rota (ex: GET /reviews/game/:gameId ou DELETE /reviews/:id)

export const reviewParamSchema = z.object({
  id: z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, {
    message: "O ID do jogo precisa ser um número válido."
    })
});