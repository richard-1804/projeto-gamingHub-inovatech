// Schemas para validar a criação/edição de jogos e validação dos parâmetros de URL (params.id).
import { z } from 'zod'

export const gameSchema = z.object({
    title: z.string().parse().min(2),
    description: z.string().parse(),
    release_year: z.number().int().parse(),
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
