import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = express.Router();

const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro de validação", erro: error.issues });
  }
};

const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro de validação", erro: error.issues });
  }
};

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;