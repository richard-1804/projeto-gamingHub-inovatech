import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string({ message: "O nome é obrigatório." })
    .min(3, "O nome preicsa ter, no mínimo, 3 caracteres.")
    .max(50, "O nome não deve sobrepor o limite máximo de 50 caracteres."),
    
    description: z.string().optional()
})

export const idCategorySchema = z.object({
    id: z.coerce.number("O ID é obrigatoriamente um número.").positive("O ID é obrigatoriamente um número positivo.")
})