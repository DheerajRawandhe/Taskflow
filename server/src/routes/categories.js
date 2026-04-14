import express from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all category operations require authentication
router.post('/', auth, createCategory);
router.get('/', auth, getCategories);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
