const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nftController = require('../controllers/nftController');
const auth = require('../middleware/auth');

const router = express.Router();

const createNFTLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 50, // Limitar a 50 creaciones de NFT por día
  message: 'Ha excedido el límite de creación de NFTs, por favor intente mañana.'
});

router.post('/', auth, createNFTLimiter, [
  body('name').trim().escape().notEmpty(),
  body('description').trim().escape().notEmpty(),
  body('image').isURL(),
  body('tokenId').trim().notEmpty()
], nftController.createNFT);

router.get('/', auth, nftController.getNFTs);

router.put('/:id', auth, [
  param('id').isMongoId(),
  body('name').optional().trim().escape(),
  body('description').optional().trim().escape(),
  body('image').optional().isURL()
], nftController.updateNFT);

router.delete('/:id', auth, [
  param('id').isMongoId()
], nftController.deleteNFT);

module.exports = router;
