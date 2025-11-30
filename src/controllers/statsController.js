const Transaction = require('../models/Transaction');
const NFT = require('../models/NFT');
const Ticket = require('../models/Ticket');
const CheckinAudit = require('../models/CheckinAudit');

exports.getKpis = async (req, res, next) => {
  try {
    const [totalNFTs, totalTransactions, confirmedSales, totalTickets, usedTickets, totalCheckins] = await Promise.all([
      NFT.countDocuments(),
      Transaction.countDocuments(),
      Transaction.countDocuments({ type: 'SALE', status: 'CONFIRMED' }).catch(() => 0),
      Ticket.countDocuments(),
      Ticket.countDocuments({ used: true }),
      CheckinAudit.countDocuments({ result: 'SUCCESS' })
    ]);

    // Revenue from confirmed sales (sum amounts). If Transaction schema differs, try alternative fields.
    let revenue = 0;
    try {
      const sales = await Transaction.find({ type: 'SALE', status: 'CONFIRMED' }, { amount: 1 });
      revenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);
    } catch (_) {
      // fallback: price field
      const sales = await Transaction.find({}, { price: 1 }).catch(() => []);
      revenue = sales.reduce((acc, s) => acc + (s.price || 0), 0);
    }

    res.json({
      totalNFTs,
      totalTransactions,
      confirmedSales,
      revenue,
      totalTickets,
      usedTickets,
      totalCheckins,
    });
  } catch (err) {
    next(err);
  }
};
