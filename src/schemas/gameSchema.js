// Schemas para validar a criação/edição de jogos e validação dos parâmetros de URL (params.id).
import { z } from 'zod'

export const gameSchema = z.object({
    title: z.string().min(2),
    description: z.string(),
    release_year: z.number().int(),
    categories_id_fk: z.number().int().positive()
})// tabela games do schema prisma traduzida em zod

export const gaidpar = z.object ({
    id: z.coerce
    .number()
    .positive()
    .transform((val) => Number(val))
    .refine(
        (val) => !isNaN(val),
        {
            message: "É necessário que o ID seja um numero valido, tente novamente" 
        }
    )
})// vai validar o ID


// Validação do ID  via URL usando z.coerce.number() para conversão em number
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("O ID deve ser um número inteiro positivo")
});

// Schema para atualização parcial/total do jogo
export const updateGameSchema = z.object({
  title: z.string().min(1, "O título não pode estar vazio").optional(),
  description: z.string().optional(),
  year: z.coerce.number().int().optional(),
  categoryId: z.coerce.number().int().optional()
});