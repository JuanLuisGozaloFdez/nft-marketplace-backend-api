const express = require('express');
const router = express.Router();
const { validateCheckin } = require('../controllers/checkinController');
const { authenticate } = require('../utils/jwtUtils');

// Protected route: validators must be authenticated
router.post('/validate', authenticate, validateCheckin);

module.exports = router;
const express = require('express')
const { body } = require('express-validator')
const auth = require('../middleware/auth')
const checkinController = require('../controllers/checkinController')

const router = express.Router()

router.post('/validate', auth, [
  body('tokenId').isString().notEmpty(),
  body('expectedOwner').optional().isString()
], checkinController.validateCheckin)

module.exports = router
