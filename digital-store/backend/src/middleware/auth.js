const jwt = require('jsonwebtoken');

// Protege as rotas que precisam de login (POST, PUT e DELETE).
// O cliente deve enviar o cabeçalho: Authorization: Bearer <token>
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Envie o cabeçalho Authorization: Bearer <token>' });
  }

  try {
    const token = header.replace('Bearer ', '');
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

module.exports = auth;
