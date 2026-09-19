export const validate = (schema) => (req, res, next) => {
  try {
    // Valida e sobrescreve o req.body com os dados validados
    req.body = schema.parse(req.body);
    next(); // Libera para o controller!
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.issues });
    }
    return res.status(500).json({ message: "Erro na validação" });
  }
};