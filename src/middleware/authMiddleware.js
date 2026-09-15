// Função que extrai o token do header Authorization: Bearer <TOKEN_JWT>, valida com jsonwebtoken e bloqueia requisições sem credencial com o status 401 Unauthorized.
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const parts = authHeader.split(' '); 
  if (parts.length !== 2 || parts[0] !== 'Bearer') { 
    return res.status(401).json({ message: "Token Inválido" });
  }

  const token = parts[1].trim().replace(/^"|"$/g, '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
