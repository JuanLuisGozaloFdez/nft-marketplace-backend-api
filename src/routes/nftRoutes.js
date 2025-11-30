const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nftController = require('../controllers/nftController');
const { authenticate, authorize } = require('../utils/jwtUtils');

const router = express.Router();

const createNFTLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 50, // Limitar a 50 creaciones de NFT por día
  message: 'Ha excedido el límite de creación de NFTs, por favor intente mañana.'
});

router.post('/', authenticate, createNFTLimiter, [
  body('name').trim().escape().notEmpty(),
  body('description').trim().escape().notEmpty(),
  body('image').isURL(),
  body('tokenId').trim().notEmpty()
], nftController.createNFT);

router.get('/', authenticate, nftController.getNFTs);

router.put('/:id', authenticate, [
  param('id').isMongoId(),
  body('name').optional().trim().escape(),
  body('description').optional().trim().escape(),
  body('image').optional().isURL()
], nftController.updateNFT);

router.delete('/:id', authenticate, [
  param('id').isMongoId()
], nftController.deleteNFT);

// Admin mint endpoint
router.post('/admin/mint', authenticate, authorize(['admin','organizer']), [
  body('to').isString().notEmpty(),
  body('ticketId').isString().notEmpty(),
  body('metadata').optional().isObject()
], nftController.adminMintNFT);

// Admin owner lookup
router.get('/admin/owner/:tokenId', authenticate, authorize(['admin','organizer']), [
  param('tokenId').isString().notEmpty()
], nftController.adminGetOwner);

module.exports = router;
