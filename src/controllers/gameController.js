// Lógica do CRUD dos jogos utilizando o tratamento try/catch para capturar os erros disparados pelo .parse() do Zod.

import prisma from "../../db.js";
import {gameSchema, gaidpar} from "../schemas/gameSchema.js"