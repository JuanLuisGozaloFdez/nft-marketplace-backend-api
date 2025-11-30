const express = require('express');
const router = express.Router();
const { getKpis } = require('../controllers/statsController');
const { checkinsDaily } = require('../controllers/statsDailyController');
const { listAudits, exportAuditsCsv } = require('../controllers/auditsController');
const { authenticate, authorize } = require('../utils/jwtUtils');

router.get('/kpis', getKpis);
router.get('/checkins/daily', checkinsDaily);
router.get('/audits', authenticate, authorize(['admin','organizer']), listAudits);
router.get('/audits/export', authenticate, authorize(['admin','organizer']), exportAuditsCsv);

module.exports = router;
