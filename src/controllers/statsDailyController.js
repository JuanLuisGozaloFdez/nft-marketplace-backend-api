const CheckinAudit = require('../models/CheckinAudit');

exports.checkinsDaily = async (req, res, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 14);
    const pipeline = [
      { $match: { createdAt: { $gte: since }, result: { $in: ['SUCCESS','ALREADY_USED'] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];
    const agg = await CheckinAudit.aggregate(pipeline);
    res.json(agg.map((d) => ({ date: d._id, count: d.count })));
  } catch (err) {
    next(err);
  }
};
