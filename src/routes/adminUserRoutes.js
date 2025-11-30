const express = require('express');
const { param, body } = require('express-validator');
const { authenticate, authorize } = require('../utils/jwtUtils');
const ctrl = require('../controllers/adminUserController');

const router = express.Router();

router.get('/users', authenticate, authorize(['admin']), ctrl.listUsers);
router.put('/users/:id/role', authenticate, authorize(['admin']), [
  param('id').isMongoId(),
  body('role').isString().isIn(['admin','organizer','staff','user']),
  body('reason').optional().isString()
], ctrl.updateUserRole);

module.exports = router;
