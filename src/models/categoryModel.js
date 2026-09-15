// Lógica de banco para Categorias (listar categorias, vincular ao jogo).

import prisma from "../db.js"

export const getAllCategoriesModel = async () => {
    return await prisma.categories.findMany({
        include: {games: true}
    })
}

export const getIdCategoriesModel = async (id) => {
    return await prisma.categories.findUnique({
        where: { id_categories_pk: id },
        include: {games: true}
    })
}

export const createCategoryModel = async (data) => {
    return await prisma.categories.create({
        data
    })
}

export const updateCategoryModel = async (id, data) => {
    return await prisma.categories.update({
        where: {id_categories_pk: id}
        data
    })
}

export const deleteCategoryModel = async (id) => {
    return await prisma.categories.delete({
        where: {id_categories_pk: id}
    })
}