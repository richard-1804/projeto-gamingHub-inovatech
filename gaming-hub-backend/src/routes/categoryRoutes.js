import express from 'express';
import { 
  getCategories, 
  getCategoriesById, 
  createCategories, 
  updateCategories, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createCategorySchema, idCategorySchema } from '../schemas/categorySchema.js';

const router = express.Router();

// Middlewares de Validação Zod
const validateCategoryBody = (req, res, next) => {
  try {
    createCategorySchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "Dados da categoria inválidos", erro: error.issues });
  }
};

const validateCategoryIdParam = (req, res, next) => {
  try {
    idCategorySchema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "ID da categoria inválido", erro: error.issues });
  }
};

// Rotas de Categorias
router.get('/', getCategories);
router.get('/:id', validateCategoryIdParam, getCategoriesById);
router.post('/', authMiddleware, validateCategoryBody, createCategories);
router.put('/:id', authMiddleware, validateCategoryIdParam, validateCategoryBody, updateCategories);
router.delete('/:id', authMiddleware, validateCategoryIdParam, deleteCategory);

export default router;