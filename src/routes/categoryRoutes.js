import express from 'express';
import { 
  getCategories, 
  getCategoriesById, 
  createCategories, 
  updateCategories, 
  deleteCategory 
} from '../controllers/categoryController.js';

import { authMiddleware } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoriesById);
router.post('/', authMiddleware, createCategories);
router.put('/:id', authMiddleware, updateCategories);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;