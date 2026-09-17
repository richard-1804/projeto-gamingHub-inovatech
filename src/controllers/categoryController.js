import * as categoryModel from "../models/categoryModel.js";

// 1. Listar todas as categorias (Público)
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategoriesModel();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno no servidor ao buscar categorias.", detalhe: error.message });
  }
};

// 2. Buscar categoria por ID (Público)
export const getCategoriesById = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const category = await categoryModel.getIdCategoriesModel(categoryId);
    if (!category) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno no servidor ao buscar categoria.", detalhe: error.message });
  }
};

// 3. Criar categoria (Protegido por JWT)
export const createCategories = async (req, res) => {
  try {
    const newCategory = await categoryModel.createCategoryModel(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno no servidor ao criar categoria.", detalhe: error.message });
  }
};

// 4. Atualizar categoria (Protegido por JWT)
export const updateCategories = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const existingCategory = await categoryModel.getIdCategoriesModel(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    const updatedCategory = await categoryModel.updateCategoryModel(categoryId, req.body);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno no servidor ao atualizar categoria.", detalhe: error.message });
  }
};

// 5. Deletar categoria (Protegido por JWT)
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const existingCategory = await categoryModel.getIdCategoriesModel(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    await categoryModel.deleteCategoryModel(categoryId);
    return res.status(200).json({ message: "Categoria removida com sucesso." });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno no servidor ao excluir categoria.", detalhe: error.message });
  }
};