import { createCategorySchema, idCategorySchema } from "../schemas/categorySchema.js";
import * as categoryModel from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategoriesModel
        return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno no servidor"})
    }
};

export const getCategoriesById = async (req, res) => {
    try {
        const {id} = req.params

        const category = await categoryModel.getIdCategoriesModel(id)
        if(!category){
            res.status(404).json({mensagem: "ID inexistente."})
        }
        res.status(200).json(category)
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.issues });
        }
        return res.status(500).json({ erro: "Erro interno no servidor"})
    }
};

export const createCategories = async (req, res) => {
    try {
        const validatedData = createCategorySchema.parse(req.body);
        const newCategory = await categoryModel.createCategoryModel(validatedData);
        return res.status(201).json(newCategory);
    } catch (error){
        if (error.name === 'ZodError'){
            return res.status(400).json({erro: error.issues});
        }
        return res.status(500).json({ erro: "Erro interno no servidor"})
    }
};

export const updateCategories = async (req, res) => {
    try {
        const { id } = idCategorySchema.parse(req.params);
        const validatedData = createCategorySchema.parse(req.body);
        const updatedCategory = await categoryModel.updateCategoryModel(id, validatedData)
        return res.status(201).json(updatedCategory)
    } catch (error){
        if (error.name === 'ZodError'){
            return res.status(400).json({erro: error.issues});
        }
        return res.status(500).json({ erro: "Erro interno no servidor"})
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = idCategorySchema.parse(req.params);
        await categoryModel.deleteCategoryModel(id);
        return res.status(200).json({ message: "Categoria removida com sucesso." });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.issues });
        }
        return res.status(500).json({ error: "Erro ao excluir categoria." });
    }
};