const express = require('express');
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// Usuários (cadastro e login são públicos)
router.post('/user/token', UserController.token);
router.post('/user', UserController.create);
router.get('/user/:id', UserController.show);
router.put('/user/:id', auth, UserController.update);
router.delete('/user/:id', auth, UserController.remove);

// Categorias
router.get('/category/search', CategoryController.search);
router.get('/category/:id', CategoryController.show);
router.post('/category', auth, CategoryController.create);
router.put('/category/:id', auth, CategoryController.update);
router.delete('/category/:id', auth, CategoryController.remove);

// Produtos
router.get('/product/search', ProductController.search);
router.get('/product/:id', ProductController.show);
router.post('/product', auth, ProductController.create);
router.put('/product/:id', auth, ProductController.update);
router.delete('/product/:id', auth, ProductController.remove);

module.exports = router;
