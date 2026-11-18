const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Nunca devolvemos a senha para o cliente
function publicUser(user) {
  return { id: user.id, firstname: user.firstname, surname: user.surname, email: user.email };
}

// GET /v1/user/:id
async function show(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  res.status(200).json(publicUser(user));
}

// POST /v1/user
async function create(req, res) {
  const { firstname, surname, email, password, confirmPassword } = req.body || {};

  if (!firstname || !surname || !email || !password) {
    return res.status(400).json({ message: 'Preencha firstname, surname, email e password' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não conferem' });
  }
  if (await User.findOne({ where: { email } })) {
    return res.status(400).json({ message: 'E-mail já cadastrado' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstname, surname, email, password: hash });
  res.status(201).json(publicUser(user));
}

// PUT /v1/user/:id
async function update(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const { firstname, surname, email } = req.body || {};
  if (!firstname || !surname || !email) {
    return res.status(400).json({ message: 'Preencha firstname, surname e email' });
  }

  await user.update({ firstname, surname, email });
  res.status(204).end();
}

// DELETE /v1/user/:id
async function remove(req, res) {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Usuário não encontrado' });

  res.status(204).end();
}

// POST /v1/user/token  (login)
async function token(req, res) {
  const { email, password } = req.body || {};
  const user = email && (await User.findOne({ where: { email } }));

  if (!user || !password || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'E-mail ou senha incorretos' });
  }

  const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ token: jwtToken });
}

module.exports = { show, create, update, remove, token };
