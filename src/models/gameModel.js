// Lógica de banco para Jogos (listar todos, buscar por ID, criar, editar e deletar).
import prisma from "../../db.js";

export async function findAll(){
    return await prisma.games.findMany({
        include: { categories: true } //busca todos os dados relacionais categories
    })

}

export async function findById(id){
    return await prisma.games.findUnique({
        where: { id_games_pk: id },
        include: { categories: true }
    })
}

export async function create(dados){
    return await prisma.games.create({
        data: dados
    })
}