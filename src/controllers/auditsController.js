const CheckinAudit = require('../models/CheckinAudit');

exports.listAudits = async (req, res, next) => {
  try {
    const { q, eventId, result, from, to, page = 1, limit = 20 } = req.query;
    const where = {};
    if (eventId) where.eventId = String(eventId);
    if (result) where.result = String(result);
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.$gte = new Date(String(from));
      if (to) where.createdAt.$lte = new Date(String(to));
    }
    if (q) {
      where.$or = [
        { tokenId: { $regex: String(q), $options: 'i' } },
        { ownerAddress: { $regex: String(q), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20));

    const [items, total] = await Promise.all([
      CheckinAudit.find(where).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      CheckinAudit.countDocuments(where),
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      items: items.map((a) => ({
        tokenId: a.tokenId,
        eventId: a.eventId,
        ownerAddress: a.ownerAddress,
        result: a.result,
        message: a.message,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.exportAuditsCsv = async (req, res, next) => {
  try {
    const { q, eventId, result, from, to } = req.query;
    const where = {};
    if (eventId) where.eventId = String(eventId);
    if (result) where.result = String(result);
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.$gte = new Date(String(from));
      if (to) where.createdAt.$lte = new Date(String(to));
    }
    if (q) {
      where.$or = [
        { tokenId: { $regex: String(q), $options: 'i' } },
        { ownerAddress: { $regex: String(q), $options: 'i' } },
      ];
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audits.csv"');
    res.write(['tokenId','eventId','ownerAddress','result','message','createdAt'].join(',') + '\n');

    const cursor = CheckinAudit.find(where).sort({ createdAt: -1 }).cursor();
    cursor.on('data', (a) => {
      const row = [a.tokenId, a.eventId, a.ownerAddress, a.result, a.message || '', a.createdAt?.toISOString() || ''];
      res.write(row.map((c) => JSON.stringify(c)).join(',') + '\n');
    });
    cursor.on('end', () => res.end());
    cursor.on('error', (err) => next(err));
  } catch (err) {
    next(err);
  }
};
