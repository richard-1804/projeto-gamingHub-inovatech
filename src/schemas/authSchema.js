// Schemas para validar o corpo (body) das requisições de login e registro.
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("O e-mail é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória") // Corrigido de "senha" para "password"
});