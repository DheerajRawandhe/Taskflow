import express from 'express';
import {register,login,getProfile,logout} from "../controllers/authControllers.js";
import {protect} from '../middleware/auth.js'

const router=express.Router();
router.post('/register',register);
router.post('/login',login);

// Protected routes
router.get('/profile',protect,getProfile);
router.post('/logout',protect,logout);

export default router;