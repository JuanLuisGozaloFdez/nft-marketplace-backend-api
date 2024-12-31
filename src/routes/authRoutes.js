const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const twoFactorAuth = require('../middleware/twoFactorAuth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limitar a 5 intentos por ventana
  message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde.'
});

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('username').trim().escape()
], authController.register);

router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').trim()
], twoFactorAuth.generate, authController.login);

router.post('/verify-2fa', [
  body('token').trim().isLength({ min: 6, max: 6 })
], twoFactorAuth.verify, authController.verifyTwoFactor);

module.exports = router;
