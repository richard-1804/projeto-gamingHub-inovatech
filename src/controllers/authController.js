// Lógica de cadastro (com hash do bcryptjs) e de login (com geração de token JWT).
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import { findUserByEmail, createUser } from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body); 
    const userExists = await findUserByEmail(data.email);

    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    return res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.issues });
    }
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await findUserByEmail(data.email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id_users_pk, email: user.email }, 
      process.env.JWT_SECRET || "chave_secreta",
      { expiresIn: '8h' }
    );
    
    return res.status(200).json({ token });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.issues });
    }
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
  




