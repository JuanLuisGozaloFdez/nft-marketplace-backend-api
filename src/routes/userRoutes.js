const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

const updateProfileLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Limitar a 5 actualizaciones de perfil por hora
  message: 'Ha excedido el límite de actualizaciones de perfil, por favor intente más tarde.'
});

router.get('/profile', auth, userController.getProfile);

router.put('/profile', auth, updateProfileLimiter, [
  body('username').optional().trim().escape(),
  body('email').optional().isEmail().normalizeEmail()
], userController.updateProfile);

module.exports = router;
