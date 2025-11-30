const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../utils/jwtUtils');
const ctrl = require('../controllers/eventController');

const router = express.Router();

router.get('/events', authenticate, authorize(['admin','organizer']), ctrl.list);

router.post('/events', authenticate, authorize(['admin','organizer']), [
  body('name').isString().isLength({ min: 3 }),
  body('event_date').isISO8601(),
  body('status').optional().isIn(['draft','published','archived'])
], ctrl.create);

router.put('/events/:id', authenticate, authorize(['admin','organizer']), [
  param('id').isMongoId(),
  body('name').optional().isString().isLength({ min: 3 }),
  body('event_date').optional().isISO8601(),
  body('status').optional().isIn(['draft','published','archived'])
], ctrl.update);

router.delete('/events/:id', authenticate, authorize(['admin','organizer']), [
  param('id').isMongoId()
], ctrl.remove);

module.exports = router;
