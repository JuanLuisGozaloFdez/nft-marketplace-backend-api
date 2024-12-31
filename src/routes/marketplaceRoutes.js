const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const marketplaceController = require('../controllers/marketplaceController');
const auth = require('../middleware/auth');

const router = express.Router();

const listingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limitar a 10 listados por hora
  message: 'Ha excedido el límite de listados, por favor intente más tarde.'
});

router.post('/list', auth, listingLimiter, [
  body('nftId').isMongoId(),
  body('price').isFloat({ min: 0 }),
], marketplaceController.listNFT);

router.post('/buy/:id', auth, [
  param('id').isMongoId()
], marketplaceController.buyNFT);

module.exports = router;
